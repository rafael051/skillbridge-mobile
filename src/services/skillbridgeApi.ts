// File: src/services/skillbridgeApi.ts
import axios from "axios";
import { Platform } from "react-native";

/**
 * 🌐 Base da API SkillBridge (.NET)
 *
 * Backend atual (.NET): http://localhost:5028
 *
 * ⚠️ IMPORTANTE (mobile):
 * - iOS/Web (no mesmo PC da API):  http://localhost:5028
 * - Android Emulator (Expo Go):    http://10.0.2.2:5028
 * - Dispositivo físico:           http://SEU_IP_LAN:5028
 *                                  (ex: http://192.168.0.15:5028)
 *
 * A env EXPO_PUBLIC_SKILLBRIDGE_API_BASE tem prioridade.
 */
const DEFAULT_BASE =
    Platform.OS === "android"
        ? "http://10.0.2.2:5028"
        : "http://localhost:5028";

let API_BASE_SKILLBRIDGE =
    (process.env.EXPO_PUBLIC_SKILLBRIDGE_API_BASE || "").trim() ||
    DEFAULT_BASE;

/** Permite trocar a base em runtime (útil pra apontar pro Render/Azure) */
export function setSkillbridgeApiBase(url: string) {
    API_BASE_SKILLBRIDGE = url;
    skillbridgeApi.defaults.baseURL = url;
}

/** Consultar a base atual (debug/log) */
export function getSkillbridgeApiBase() {
    return API_BASE_SKILLBRIDGE;
}

/** Token JWT atual (quando fizer login no .NET) */
let authToken: string | null = null;

/** Configurar token JWT (Authorization: Bearer ...) */
export function setAuthToken(token: string | null) {
    authToken = token;
    if (token) {
        skillbridgeApi.defaults.headers.Authorization = `Bearer ${token}`;
    } else {
        delete skillbridgeApi.defaults.headers.Authorization;
    }
}

/** Cliente axios dedicado pra SkillBridge */
export const skillbridgeApi = axios.create({
    baseURL: API_BASE_SKILLBRIDGE,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

/** Aceitar AbortController.signal sem quebrar spread */
type Cfg = { signal?: any };

const withSignal = (c?: Cfg) =>
    c?.signal ? { signal: c.signal as any } : {};

/** Helpers HTTP genéricos */
const get = async <T>(url: string, params?: any, c?: Cfg): Promise<T> =>
    skillbridgeApi
        .get<T>(url, { ...withSignal(c), params })
        .then((r) => r.data);

const post = async <T>(url: string, data?: any, c?: Cfg): Promise<T> =>
    skillbridgeApi
        .post<T>(url, data, withSignal(c))
        .then((r) => r.data);

const put = async <T = void>(url: string, data?: any, c?: Cfg): Promise<T> =>
    skillbridgeApi
        .put<T>(url, data, withSignal(c))
        .then((r) => r.data);

const del = async (url: string, c?: Cfg): Promise<void> =>
    skillbridgeApi
        .delete(url, withSignal(c))
        .then(() => {});

/* ============================================================================
   Tipos ALINHADOS ao OpenAPI da API SkillBridge (.NET)
   ============================================================================ */

/** Login (só será usado se você tiver AuthController no .NET) */
export type LoginRequestDTO = {
    email: string;
    senha: string;
};

export type ClienteResponseDTO = {
    id?: number;
    nome?: string | null;
    email?: string | null;
    profissaoAtual?: string | null;
    competencias?: string | null;
};

export type LoginResponseDTO = {
    token?: string | null;
    cliente?: ClienteResponseDTO | null;
};

/** ClienteRequestDTO – exatamente igual ao schema do OpenAPI */
export type ClienteRequestDTO = {
    nome: string;
    email: string;
    senha: string;
    profissaoAtual?: string | null;
    competencias: string;
};

/** Job (vaga) */
export type JobRequestDTO = {
    titulo: string;
    requisitos: string;
    empresa: string;
};

export type JobResponseDTO = {
    id?: number;
    titulo?: string | null;
    requisitos?: string | null;
    empresa?: string | null;
};

/** Links HATEOAS que o back manda junto (self/delete/etc.) */
export type LinkDTO = {
    rel?: string;
    href?: string;
    method?: string;
};

/** Item da lista de clientes que vem na página */
export type ClienteListItemDTO = {
    cliente?: ClienteResponseDTO | null;
    links?: LinkDTO[];
};

/** Item da lista de jobs que vem na página */
export type JobListItemDTO = {
    job?: JobResponseDTO | null;
    links?: LinkDTO[];
};

/** Recomendação de vaga: geralmente JobResponseDTO + score opcional */
export type JobRecommendationDTO = JobResponseDTO & {
    score?: number;
};

/**
 * Resposta paginada genérica.
 *
 * O back atualmente usa:
 * {
 *   "total": 5,
 *   "page": 1,
 *   "pageSize": 10,
 *   "items": [ ... ],
 *   "traceId": "..."
 * }
 *
 * Mas deixamos tolerante pra evoluções futuras.
 */
export type PagedResult<TItem> = {
    total?: number; // nome usado no .NET atual
    totalItems?: number;
    totalPages?: number;
    page?: number;
    pageSize?: number;
    items?: TItem[];
    traceId?: string;
    _links?: Record<string, any>;
} | any;

/* ============================================================================
   Utils de AbortController
   ============================================================================ */
export function newAbortSkillbridge(ms?: number): AbortController {
    const controller = new AbortController();
    if (ms && ms > 0) {
        const t = setTimeout(() => controller.abort(), ms);
        // @ts-ignore
        controller.__timeout = t;
    }
    return controller;
}

/* ============================================================================
   Serviço SkillBridge – Auth, Cliente, Job, Recomendação, Health
   ============================================================================ */

/* ---------------- AUTH ---------------- */
export async function login(
    data: LoginRequestDTO,
    c?: Cfg
): Promise<LoginResponseDTO> {
    const resp = await post<LoginResponseDTO>("/api/v1/Auth/login", data, c);
    return resp;
}

/* ---------------- CLIENTES ---------------- */

/**
 * GET /api/v1/Cliente
 *
 * Backend devolve algo como:
 * {
 *   "total": 5,
 *   "page": 1,
 *   "pageSize": 10,
 *   "items": [
 *     {
 *       "cliente": { ...ClienteResponseDTO },
 *       "links": [ { "rel": "self", "href": "/api/v1/Cliente/4" }, ... ]
 *     },
 *     ...
 *   ],
 *   "traceId": "..."
 * }
 *
 * Esta função já extrai e retorna **apenas o array de ClienteResponseDTO**.
 */
export async function getClientes(
    page = 1,
    pageSize = 10,
    c?: Cfg
): Promise<ClienteResponseDTO[]> {
    const raw = await get<PagedResult<ClienteListItemDTO> | ClienteResponseDTO[]>(
        "/api/v1/Cliente",
        { page, pageSize },
        c
    );

    // Caso o back (ou algum mock) devolva diretamente um array de clientes
    if (Array.isArray(raw)) {
        return raw as ClienteResponseDTO[];
    }

    // Padrão atual: página com items[ { cliente, links } ]
    if (raw && Array.isArray(raw.items)) {
        const first = raw.items[0];

        // items: [ { cliente: {...}, links: [...] }, ... ]
        if (first && typeof first === "object" && "cliente" in first) {
            return (raw.items as ClienteListItemDTO[])
                .map((i) => i.cliente)
                .filter(Boolean) as ClienteResponseDTO[];
        }

        // items: [ { ...ClienteResponseDTO }, ... ]
        return raw.items as ClienteResponseDTO[];
    }

    // Outro formato genérico: { data: [ ...clientes... ] }
    if (raw && Array.isArray((raw as any).data)) {
        return (raw as any).data as ClienteResponseDTO[];
    }

    return [];
}

export async function createCliente(
    data: ClienteRequestDTO,
    c?: Cfg
): Promise<ClienteResponseDTO> {
    return post<ClienteResponseDTO>("/api/v1/Cliente", data, c);
}

export async function updateCliente(
    id: number,
    data: ClienteRequestDTO,
    c?: Cfg
): Promise<ClienteResponseDTO> {
    return put<ClienteResponseDTO>(`/api/v1/Cliente/${id}`, data, c);
}

export async function deleteCliente(id: number, c?: Cfg): Promise<void> {
    return del(`/api/v1/Cliente/${id}`, c);
}

/* ---------------- JOBS (VAGAS) ---------------- */

/**
 * GET /api/v1/Job
 *
 * Backend tende a devolver estrutura similar à de Cliente:
 * {
 *   "total": 5,
 *   "page": 1,
 *   "pageSize": 10,
 *   "items": [
 *     {
 *       "job": { ...JobResponseDTO },
 *       "links": [ ... ]
 *     },
 *     ...
 *   ],
 *   "traceId": "..."
 * }
 *
 * Esta função devolve apenas o array de JobResponseDTO.
 */
export async function getJobs(
    page = 1,
    pageSize = 10,
    c?: Cfg
): Promise<JobResponseDTO[]> {
    const raw = await get<PagedResult<JobListItemDTO> | JobResponseDTO[]>(
        "/api/v1/Job",
        { page, pageSize },
        c
    );

    // Caso venha direto um array de jobs
    if (Array.isArray(raw)) {
        return raw as JobResponseDTO[];
    }

    // Padrão paginado
    if (raw && Array.isArray(raw.items)) {
        const first = raw.items[0];

        // items: [ { job: {...}, links: [...] }, ... ]
        if (first && typeof first === "object" && "job" in first) {
            return (raw.items as JobListItemDTO[])
                .map((i) => i.job)
                .filter(Boolean) as JobResponseDTO[];
        }

        // items: [ { ...JobResponseDTO }, ... ]
        return raw.items as JobResponseDTO[];
    }

    // Formato alternativo: { data: [ ...jobs... ] }
    if (raw && Array.isArray((raw as any).data)) {
        return (raw as any).data as JobResponseDTO[];
    }

    return [];
}

export async function createJob(
    data: JobRequestDTO,
    c?: Cfg
): Promise<JobResponseDTO> {
    return post<JobResponseDTO>("/api/v1/Job", data, c);
}

export async function updateJob(
    id: number,
    data: JobRequestDTO,
    c?: Cfg
): Promise<JobResponseDTO> {
    return put<JobResponseDTO>(`/api/v1/Job/${id}`, data, c);
}

export async function deleteJob(id: number, c?: Cfg): Promise<void> {
    return del(`/api/v1/Job/${id}`, c);
}

/* ---------------- RECOMENDAÇÕES ---------------- */

export async function getRecomendacoesJobs(
    clienteId: number,
    topN = 5,
    c?: Cfg
): Promise<JobRecommendationDTO[]> {
    const raw = await get<any>(
        `/api/v1/recomendacao/jobs/${clienteId}`,
        { topN },
        c
    );

    if (Array.isArray(raw)) {
        return raw as JobRecommendationDTO[];
    }
    return [];
}

/* ---------------- HEALTH ---------------- */

export async function getApiHealth(c?: Cfg): Promise<any> {
    return get<any>("/health", undefined, c);
}
