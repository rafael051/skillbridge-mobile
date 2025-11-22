// File: src/utils/montarParametrosSkillBridge.ts

/**
 * Compacta objeto removendo undefined/null/""
 */
function compact(obj: Record<string, any>): Record<string, any> {
    return Object.fromEntries(
        Object.entries(obj).filter(
            ([_, v]) => v !== undefined && v !== null && v !== ""
        )
    );
}

/* ============================================================================
   Datas (se você precisar no futuro)
   - Mantendo helpers iguais ao MotoTrack para padrão PT-BR
   ============================================================================ */

const pad2 = (v: number | string) => String(v).padStart(2, "0");
const pad4 = (v: number | string) => String(v).padStart(4, "0");

/** Tenta criar um Date a partir de:
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
   fields: nome, email, profissaoAtual, competencias
   paginação: page, pageSize
   ============================================================================ */

export type FiltroClientes = {
    nome?: string;
    email?: string;
    profissaoAtual?: string;
    competencias?: string;
    page?: number;
    pageSize?: number;
    sort?: string; // se você criar ordenação no back depois (ex: "nome,asc")
};

export function montarParamsClientes(f: FiltroClientes = {}) {
    return compact({
        nome: f.nome,
        email: f.email,
        profissaoAtual: f.profissaoAtual,
        competencias: f.competencias,
        page: f.page,
        pageSize: f.pageSize,
        sort: f.sort,
    });
}

/* ============================================================================
   Filtro de Jobs – GET /api/v1/Job
   fields: titulo, empresa, requisitos
   paginação: page, pageSize
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
   aqui só temos topN como query; clienteId vai na rota
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

/* Exports utilitários (se precisar) */
export const DateUtilsSkillBridgePtBr = {
    toDateSafe,
    toPtBrDate,
    toPtBrDateTime,
};
