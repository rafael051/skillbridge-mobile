// File: src/utils/montarParametrosSkillBridge.ts

/**
 * Compacta objeto removendo undefined/null/""
 * Útil pra montar params de query string sem lixo.
 */
function compact(obj: Record<string, any>): Record<string, any> {
    return Object.fromEntries(
        Object.entries(obj).filter(
            ([_, v]) => v !== undefined && v !== null && v !== ""
        )
    );
}

/* ============================================================================
   Datas (helpers PT-BR, se você precisar no futuro)
   ============================================================================ */

const pad2 = (v: number | string) => String(v).padStart(2, "0");
const pad4 = (v: number | string) => String(v).padStart(4, "0");

/**
 * Tenta criar um Date a partir de:
 *  - Date
 *  - "dd/MM/yyyy HH:mm[:ss]"
 *  - "dd/MM/yyyy"
 *  - Qualquer string parseável pelo JS Date (fallback)
 */
function toDateSafe(input?: string | Date): Date | undefined {
    if (!input) return undefined;
    if (input instanceof Date) return isNaN(+input) ? undefined : input;

    const s = String(input).trim();

    // dd/MM/yyyy HH:mm[:ss]
    const m1 = s.match(
        /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})(?::(\d{2}))?$/
    );
    if (m1) {
        const [, dd, mm, yyyy, HH, MI, SS = "00"] = m1;
        const d = new Date(
            Number(yyyy),
            Number(mm) - 1,
            Number(dd),
            Number(HH),
            Number(MI),
            Number(SS)
        );
        return isNaN(+d) ? undefined : d;
    }

    // dd/MM/yyyy
    const m2 = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (m2) {
        const [, dd, mm, yyyy] = m2;
        const d = new Date(
            Number(yyyy),
            Number(mm) - 1,
            Number(dd),
            0,
            0,
            0
        );
        return isNaN(+d) ? undefined : d;
    }

    // Fallback: deixar o JS tentar
    const d = new Date(s);
    return isNaN(+d) ? undefined : d;
}

/** Formata para "dd/MM/yyyy" */
function toPtBrDate(input?: string | Date): string | undefined {
    const d = toDateSafe(input);
    if (!d) return undefined;
    return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${pad4(
        d.getFullYear()
    )}`;
}

/** Formata para "dd/MM/yyyy HH:mm:ss" */
function toPtBrDateTime(input?: string | Date): string | undefined {
    const d = toDateSafe(input);
    if (!d) return undefined;
    return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${pad4(
        d.getFullYear()
    )} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(
        d.getSeconds()
    )}`;
}

/* ============================================================================
   Filtro de Clientes – GET /api/v1/Cliente
   OpenAPI atual documenta page e pageSize.
   Os campos nome/email/profissaoAtual/competencias são opcionais e só
   serão usados se você implementar filtros no backend.
   ============================================================================ */

export type FiltroClientes = {
    nome?: string;
    email?: string;
    profissaoAtual?: string;
    competencias?: string;
    page?: number;
    pageSize?: number;
    sort?: string; // ex.: "nome,asc"
};

export function montarParamsClientes(f: FiltroClientes = {}) {
    return compact({
        // Campos de filtro (caso o backend passe a aceitar)
        nome: f.nome,
        email: f.email,
        profissaoAtual: f.profissaoAtual,
        competencias: f.competencias,
        // Paginação (documentada no OpenAPI)
        page: f.page,
        pageSize: f.pageSize,
        // Ordenação opcional
        sort: f.sort,
    });
}

/* ============================================================================
   Filtro de Jobs – GET /api/v1/Job
   OpenAPI atual documenta page e pageSize.
   titulo/empresa/requisitos são filtros extras opcionais.
   ============================================================================ */

export type FiltroJobs = {
    titulo?: string;
    empresa?: string;
    requisitos?: string;
    page?: number;
    pageSize?: number;
    sort?: string;
};

export function montarParamsJobs(f: FiltroJobs = {}) {
    return compact({
        titulo: f.titulo,
        empresa: f.empresa,
        requisitos: f.requisitos,
        page: f.page,
        pageSize: f.pageSize,
        sort: f.sort,
    });
}

/* ============================================================================
   Filtro de Recomendações – GET /api/v1/recomendacao/jobs/{clienteId}
   No OpenAPI, só existe topN como query; clienteId vai na rota.
   ============================================================================ */

export type FiltroRecomendacaoJobs = {
    topN?: number;
};

export function montarParamsRecomendacaoJobs(
    f: FiltroRecomendacaoJobs = {}
) {
    return compact({
        topN: f.topN,
    });
}

/* Exports utilitários de data (se precisar em outras telas) */
export const DateUtilsSkillBridgePtBr = {
    toDateSafe,
    toPtBrDate,
    toPtBrDateTime,
};
