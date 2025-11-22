// File: src/services/skillbridgeIaApi.ts
import axios, { AxiosRequestConfig } from "axios";

/**
 * 🌐 Base da API de IA (FastAPI)
 * - Android Emulador: http://10.0.2.2:8080
 * - Localhost PC:     http://localhost:8080
 * - Production:       use EXPO_PUBLIC_IA_BASE
 */
let IA_BASE =
    process.env.EXPO_PUBLIC_IA_BASE?.trim() || "http://10.0.2.2:8080";

export function setIaApiBase(url: string) {
    IA_BASE = url;
    iaApi.defaults.baseURL = url;
}

export function getIaApiBase() {
    return IA_BASE;
}

/** Cliente axios da IA */
export const iaApi = axios.create({
    baseURL: IA_BASE,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

/** Aceitar AbortController.signal */
type Cfg = { signal?: AbortSignal };
const withSignal = (c?: Cfg): AxiosRequestConfig =>
    c?.signal ? { signal: c.signal as any } : {};

/* ========================================================================
   Tipos principais da IA  (ALINHADOS ao OpenAPI)
   ======================================================================== */

/** Health da IA */
export type IaHealth = {
    status?: string; // "ok", "healthy" etc.
    model?: string; // ex: "gpt-4o-mini"
    timestamp?: string; // se você retornar isso no backend
};

/* ---------- /gen/cv/html e /gen/cv/html/demo ---------- */

/**
 * OpenAPI: CvRequest
 * {
 *   dados: object;
 *   idioma?: string | null;
 * }
 */
export type CvHtmlRequest = {
    dados: Record<string, any>;
    idioma?: string | null;
};

/** Resposta de /gen/cv/html e /gen/cv/html/demo → text/html (string) */
export type CvHtmlResponse = string;

/* ---------- /gen/plan (HTML) ---------- */

/**
 * OpenAPI: Perfil
 * {
 *   softSkills: string[];
 *   hardSkills: string[];
 *   objetivo?: string | null;
 *   disponibilidadeSemanalHoras?: number | null;
 * }
 */
export type Perfil = {
    softSkills: string[];
    hardSkills: string[];
    objetivo?: string | null;
    disponibilidadeSemanalHoras?: number | null;
};

/**
 * OpenAPI: PlanRequest
 * {
 *   perfil: Perfil;
 *   idioma?: string | null;
 * }
 */
export type PlanRequest = {
    perfil: Perfil;
    idioma?: string | null;
};

/** Resposta de /gen/plan → text/html (string) */
export type PlanHtmlResponse = string;

/* ---------- /gen/explain/html ---------- */

/**
 * OpenAPI: ExplainRequest
 * {
 *   contexto: object;
 *   idioma?: string | null;
 * }
 */
export type ExplainRequest = {
    contexto: Record<string, any>;
    idioma?: string | null;
};

/** Resposta de /gen/explain/html → text/html (string) */
export type ExplainHtmlResponse = string;

/* ========================================================================
   Helpers HTTP
   ======================================================================== */

const get = async <T>(url: string, params?: any, c?: Cfg): Promise<T> =>
    iaApi.get<T>(url, { ...withSignal(c), params }).then((r) => r.data);

const post = async <T>(url: string, data?: any, c?: Cfg): Promise<T> =>
    iaApi.post<T>(url, data, withSignal(c)).then((r) => r.data);

/* ========================================================================
   SkillBridgeIA – funções por endpoint
   ======================================================================== */

export const SkillBridgeIA = {
    /* ---------- Health ---------- */
    getHealth(c?: Cfg): Promise<IaHealth> {
        return get<IaHealth>("/health", undefined, c);
    },

    /* ---------- Currículo em HTML (dados do usuário) ---------- */
    gerarCurriculoHtml(body: CvHtmlRequest, c?: Cfg): Promise<CvHtmlResponse> {
        // Resposta é text/html (string)
        return post<string>("/gen/cv/html", body, c);
    },

    /* ---------- Currículo DEMO em HTML (perfil aleatório) ---------- */
    gerarCurriculoDemo(
        body: { idioma?: string | null; tipoPerfil?: string | null },
        c?: Cfg
    ): Promise<CvHtmlResponse> {
        // OpenAPI: DemoCvRequest { idioma?, tipoPerfil? }
        return post<string>("/gen/cv/html/demo", body, c);
    },

    /* ---------- Plano de requalificação / carreira (HTML) ---------- */
    gerarPlano(body: PlanRequest, c?: Cfg): Promise<PlanHtmlResponse> {
        // Agora /gen/plan devolve text/html, não JSON
        return post<string>("/gen/plan", body, c);
    },

    /* ---------- Explicação humanizada (coach) em HTML ---------- */
    gerarExplainHtml(
        body: ExplainRequest,
        c?: Cfg
    ): Promise<ExplainHtmlResponse> {
        // Rota correta do OpenAPI: /gen/explain/html
        return post<string>("/gen/explain/html", body, c);
    },
};
