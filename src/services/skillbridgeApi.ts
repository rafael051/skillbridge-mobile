// File: src/services/skillbridgeApi.ts
import axios, { AxiosRequestConfig } from "axios";

/**
 * 🌐 Base da API SkillBridge (.NET)
 * - iOS/Web:        http://localhost:5080
 * - Android Emul.:  http://10.0.2.2:5080
 * - Dispositivo:    http://SEU_IP_LAN:5080
 *
 * A env EXPO_PUBLIC_SKILLBRIDGE_API_BASE tem prioridade.
 */
let API_BASE_SKILLBRIDGE =
    process.env.EXPO_PUBLIC_SKILLBRIDGE_API_BASE?.trim() || "http://localhost:5080";

/** Permite trocar a base em runtime (útil pra apontar pro Render/Azure) */
export function setSkillbridgeApiBase(url: string) {
    API_BASE_SKILLBRIDGE = url;
    skillbridgeApi.defaults.baseURL = url;
}

/** Consultar a base atual (debug/log) */
export function getSkillbridgeApiBase() {
    return API_BASE_SKILLBRIDGE;
}

/** Token JWT atual (quando fizer login) */
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
type Cfg = { signal?: AbortSignal };
const withSignal = (c?: Cfg): AxiosRequestConfig =>
    c?.signal ? { signal: c.signal as any } : {};

/** Helpers HTTP genéricos */
const get = async <T>(url: string, params?: any, c?: Cfg): Promise<T> =>
    skillbridgeApi.get<T>(url, { ...withSignal(c), params }).then((r) => r.data);

const post = async <T>(url: string, data?: any, c?: Cfg): Promise<T> =>
    skillbridgeApi.post<T>(url, data, withSignal(c)).then((r) => r.data);

const put = async (url: string, data?: any, c?: Cfg): Promise<void> =>
    skillbridgeApi.put(url, data, withSignal(c)).then(() => {});

const del = async (url: string, c?: Cfg): Promise<void> =>
    skillbridgeApi.delete(url, withSignal(c)).then(() => {});

/* ============================================================================
   Tipos ALINHADOS ao OpenAPI da API SkillBridge (.NET)
   ============================================================================ */

/** Login */
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

/** Cliente */
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

/** Recomendação de vaga: geralmente JobResponseDTO + score opcional */
export type JobRecommendationDTO = JobResponseDTO & {
    score?: number;
};

/** Resposta paginada comum (caso você queira usar HATEOAS depois) */
export type PagedResult<T> = {
    items: T[];
    page?: number;
    pageSize?: number;
    totalItems?: number;
    totalPages?: number;
    _links?: Record<string, any>;
} | any;

/* ============================================================================
   Utils de AbortController (igual conceito do MotoTrack)
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

/**
 * Realiza login e retorna LoginResponseDTO.
 * Depois de chamar, você pode usar setAuthToken(response.token)
 */
export async function login(
    data: LoginRequestDTO,
    c?: Cfg
): Promise<LoginResponseDTO> {
    const resp = await post<LoginResponseDTO>("/api/v1/Auth/login", data, c);
    return resp;
}

/* ---------------- CLIENTES ---------------- */

/**
 * Obtém uma lista de clientes.
 * A API pode devolver:
 *  - um array direto de ClienteResponseDTO
 *  - ou um objeto paginado com `items`
 *
 * Este helper devolve sempre um array de ClienteResponseDTO.
 */
export async function getClientes(
    page = 1,
    pageSize = 10,
    c?: Cfg
): Promise<ClienteResponseDTO[]> {
    const raw = await get<any>("/api/v1/Cliente", { page, pageSize }, c);

    if (Array.isArray(raw)) {
        return raw as ClienteResponseDTO[];
    }
    if (Array.isArray(raw.items)) {
        return raw.items as ClienteResponseDTO[];
    }
    if (Array.isArray(raw.data)) {
        return raw.data as ClienteResponseDTO[];
    }
    return [];
}

/** Cria um novo cliente */
export async function createCliente(
    data: ClienteRequestDTO,
    c?: Cfg
): Promise<ClienteResponseDTO> {
    return post<ClienteResponseDTO>("/api/v1/Cliente", data, c);
}

/** Atualiza um cliente existente */
export async function updateCliente(
    id: number,
    data: ClienteRequestDTO,
    c?: Cfg
): Promise<ClienteResponseDTO> {
    return post<ClienteResponseDTO>(`/api/v1/Cliente/${id}`, data, c); // se sua API usa PUT, troque pra put(...)
}

/** Remove um cliente */
export async function deleteCliente(id: number, c?: Cfg): Promise<void> {
    return del(`/api/v1/Cliente/${id}`, c);
}

/* ---------------- JOBS (VAGAS) ---------------- */

/**
 * Obtém uma lista de vagas (jobs).
 * Mesmo esquema de tolerância: array direto ou objeto com `items`.
 */
export async function getJobs(
    page = 1,
    pageSize = 10,
    c?: Cfg
): Promise<JobResponseDTO[]> {
    const raw = await get<any>("/api/v1/Job", { page, pageSize }, c);

    if (Array.isArray(raw)) {
        return raw as JobResponseDTO[];
    }
    if (Array.isArray(raw.items)) {
        return raw.items as JobResponseDTO[];
    }
    if (Array.isArray(raw.data)) {
        return raw.data as JobResponseDTO[];
    }
    return [];
}

/** Cria uma nova vaga */
export async function createJob(
    data: JobRequestDTO,
    c?: Cfg
): Promise<JobResponseDTO> {
    return post<JobResponseDTO>("/api/v1/Job", data, c);
}

/** Atualiza uma vaga existente */
export async function updateJob(
    id: number,
    data: JobRequestDTO,
    c?: Cfg
): Promise<JobResponseDTO> {
    return put(`/api/v1/Job/${id}`, data, c).then(() => ({
        id,
        ...data,
    }));
}

/** Remove uma vaga */
export async function deleteJob(id: number, c?: Cfg): Promise<void> {
    return del(`/api/v1/Job/${id}`, c);
}

/* ---------------- RECOMENDAÇÕES ---------------- */

/**
 * Busca vagas recomendadas para um cliente:
 * GET /api/v1/recomendacao/jobs/{clienteId}?topN=5
 *
 * O backend pode retornar:
 *  - array de JobResponseDTO
 *  - array de JobRecommendationDTO (com score)
 *
 * Aqui tipamos como JobRecommendationDTO para ser mais flexível.
 */
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

/** Health básico: GET /api/v1/Health */
export async function getApiHealth(c?: Cfg): Promise<any> {
    return get<any>("/api/v1/Health", undefined, c);
}
