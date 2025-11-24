// File: src/styles/globalStyles.ts
import { StyleSheet, TextStyle, ViewStyle } from "react-native";

/* ============================================================
🎨 Global Styles — SkillBridge Mobile
============================================================ */

interface GlobalStyles {
    hintText: TextStyle;
    container: ViewStyle;
    screenTop: ViewStyle;
    screenFill: ViewStyle;

    inputContainer: ViewStyle;
    inputLabel: TextStyle;
    input: TextStyle & ViewStyle;
    button: ViewStyle;
    buttonText: TextStyle;
    smallButtonText: TextStyle;
    headerButtonText: TextStyle;

    title: TextStyle;
    subtitle: TextStyle;
    text: TextStyle;
    textCenter: TextStyle;
    textSmallMargin: TextStyle;

    card: ViewStyle;
    cardPlaca: TextStyle;
    cardModelo: TextStyle;

    header: ViewStyle;
    headerTitle: TextStyle;

    rowCenter: ViewStyle;
    link: TextStyle;
    forgotPassword: TextStyle;

    authContainer: ViewStyle;
    langButton: ViewStyle;
    langText: TextStyle;

    homeContainer: ViewStyle;
    homeHeaderContainer: ViewStyle;
    homeHeader: ViewStyle;
    homeHeaderRow: ViewStyle;
    homeStatusRow: ViewStyle;
    homeStatusDot: ViewStyle;
    homeLinkBtn: ViewStyle;
    homeCardsWrap: ViewStyle;
    homeCard: ViewStyle;
    homeFooter: ViewStyle;
    homeScrollContent: ViewStyle;

    listContainer: ViewStyle;
    jobsHeader: ViewStyle;

    homeGrid: ViewStyle;
    homeTile: ViewStyle;
    homeTileIconWrap: ViewStyle;
    homeTileCount: TextStyle;
    homeTileLabel: TextStyle;

    // Preview (Currículo / Explicação / Plano)
    previewContainer: ViewStyle;
    previewBody: ViewStyle;
    previewHeader: ViewStyle;
    previewHeaderBack: ViewStyle;
    previewHeaderAction: ViewStyle;
    previewBackText: TextStyle;
    previewActionText: TextStyle;
    previewLoader: ViewStyle;
    webViewFull: ViewStyle;
}

const globalStyles = StyleSheet.create<GlobalStyles>({
    // 📦 Containers
    container: {
        flex: 1,
        padding: 24,
        justifyContent: "center",
    },
    screenTop: {
        justifyContent: "flex-start",
    },
    screenFill: {
        flex: 1,
    },
    authContainer: {
        width: "100%",
        maxWidth: 380,
        alignSelf: "center",
    },

    // ✏️ Inputs
    inputContainer: { marginBottom: 16 },
    inputLabel: {
        marginBottom: 6,
        fontWeight: "600",
        fontSize: 14,
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        marginBottom: 14,
    },

    // 🔘 Botões (base neutra)
    button: {
        marginVertical: 14,
        paddingVertical: 14,
        paddingHorizontal: 24,
        minHeight: 48,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#020617",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "700",
        letterSpacing: 0.5,
    },
    smallButtonText: {
        fontSize: 14,
        fontWeight: "700",
        letterSpacing: 0.3,
    },
    headerButtonText: {
        fontSize: 15,
        fontWeight: "700",
        letterSpacing: 0.3,
        textAlign: "center",
    },

    // 🌐 Botões de idioma
    rowCenter: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 15,
        gap: 12,
    },
    langButton: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        minWidth: 50,
    },
    langText: {
        fontWeight: "700",
        fontSize: 14,
        color: "#fff",
    },

    // 🔤 Tipografia
    title: {
        fontSize: 26,
        fontWeight: "700",
        marginBottom: 20,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12,
        textAlign: "center",
        opacity: 0.85,
    },
    text: {
        fontSize: 16,
        lineHeight: 22,
    },
    textCenter: {
        textAlign: "center",
    },
    textSmallMargin: {
        marginBottom: 2,
    },

    // 🃏 Cards
    card: {
        padding: 20,
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: "#020617",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.14,
        shadowRadius: 6,
        elevation: 4,
    },
    cardPlaca: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 6,
    },
    cardModelo: {
        fontSize: 15,
        marginBottom: 4,
    },

    // 📑 Headers
    header: {
        height: 56,
        justifyContent: "center",
        paddingHorizontal: 16,
        elevation: 4,
    },
    headerTitle: {
        fontWeight: "700",
        fontSize: 20,
    },

    // 🌐 Auxiliares
    link: {
        marginTop: 20,
        alignSelf: "center",
        fontSize: 14,
        textDecorationLine: "underline",
    },
    forgotPassword: {
        marginTop: 20,
        alignSelf: "center",
        fontSize: 14,
    },

    // 🏠 Home (Dashboard)
    homeContainer: { flex: 1, paddingHorizontal: 16, gap: 12 },
    homeHeaderContainer: { marginBottom: 8 },
    homeHeader: { marginTop: 12, gap: 4 },
    homeHeaderRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    homeStatusRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 4,
        flexWrap: "wrap",
    },
    homeStatusDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 1,
    },
    homeLinkBtn: { paddingHorizontal: 4, paddingVertical: 2 },
    homeCardsWrap: {
        flexDirection: "row",
        gap: 12,
        marginTop: 12,
        flexWrap: "wrap",
    },
    homeCard: {
        flex: 1,
        minWidth: 150,
        padding: 12,
        borderWidth: 1,
        borderRadius: 12,
    },
    homeFooter: { paddingBottom: 16, alignItems: "center" },
    homeScrollContent: {
        paddingBottom: 24,
    },

    // container padrão de listas
    listContainer: {
        flex: 1,
        marginTop: 16,
    },

    // header específico da tela de vagas (pode ser usado em outras listas também)
    jobsHeader: {
        marginBottom: 8,
        alignItems: "center",
    },

    // 🟥 Grid e Tiles
    homeGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
        justifyContent: "space-between",
        paddingHorizontal: 4,
        marginTop: 8,
    },
    homeTile: {
        width: "48%",
        minHeight: 120,
        borderRadius: 16,
        padding: 14,
        justifyContent: "space-between",
        shadowOpacity: 0.25,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
        borderWidth: 1,
    },
    homeTileIconWrap: { alignItems: "flex-start" },
    homeTileCount: { fontSize: 28, fontWeight: "700" },
    homeTileLabel: { fontSize: 14, fontWeight: "500", opacity: 0.95 },

    // texto auxiliar menor
    hintText: {
        fontSize: 12,
        lineHeight: 18,
        marginTop: 6,
    },

    // 🧾 Preview (Currículo / Explicação / Plano)
    previewContainer: {
        flex: 1,
        padding: 0,
        justifyContent: "flex-start",
    },
    previewBody: {
        flex: 1,
    },
    previewHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    previewHeaderBack: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 999,
    },
    previewHeaderAction: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
    },
    previewBackText: {
        marginLeft: 2,
    },
    previewActionText: {
        marginLeft: 6,
        fontSize: 14,
    },
    previewLoader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    webViewFull: {
        flex: 1,
    },
});

export default globalStyles;

/* ============================================================
🧰 Utilitários — List / Form
============================================================ */
export const listStyles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        marginTop: 16,
        marginBottom: 4,
    },

    // ✅ NOVO: usado para botões lado a lado (ex.: Gerar / Limpar na CurriculoScreen)
    rowButton: {
        flex: 1,
        marginVertical: 0,
        paddingVertical: 12,
        paddingHorizontal: 12,
    },

    // usado para botões lado a lado (como na tela de recomendação e na lista de vagas)
    topButton: {
        flex: 1,
        marginVertical: 0,
        paddingVertical: 12,
        paddingHorizontal: 12,
    },
    topButtonPrimary: {},
    topButtonSecondary: {},

    cardOutlined: {
        padding: 18,
        borderRadius: 16,
        borderWidth: 1,
    },

    rowItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 12,
        padding: 16,
        borderWidth: 1,
        borderRadius: 16,
        shadowColor: "#020617",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 3,
    },
    rowItemTextCol: {
        flex: 1,
    },
    rowActions: {
        justifyContent: "space-between",
        alignItems: "stretch",
        gap: 8,
    },
    smallBtn: {
        minHeight: 40,
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    smallBtnDanger: {
        minHeight: 40,
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    smallBtnDisabled: {
        opacity: 0.6,
    },
    listSeparator: {
        height: 12,
    },
    listContent: {
        paddingVertical: 4,
    },
    listContentEmpty: {
        paddingVertical: 0,
    },
    // label de resultado da tela de recomendação
    resultLabel: {
        marginBottom: 8,
        textAlign: "left",
    },
});

export const formStyles = StyleSheet.create({
    card: {
        padding: 18,
        borderRadius: 16,
        borderWidth: 1,
    },
    dangerBtn: {
        minHeight: 48,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: "center",
    },
});

/* ============================================================
🔧 Estilos dependentes de tema
============================================================ */
export const themedStyles = (colors: any) =>
    StyleSheet.create({
        // Fundo padrão da tela
        screenBackground: {
            backgroundColor: colors.background,
        },

        // Tipografia temática
        titleText: {
            color: colors.text,
        },
        regularText: {
            color: colors.text,
        },
        mutedText: {
            color: colors.mutedText ?? "#6B7280",
        },

        errorText: {
            color: colors.error ?? colors.dangerBorder ?? "#FB7185",
            marginTop: 8,
        },

        // Inputs temáticos
        inputBase: {
            borderColor: colors.border,
            backgroundColor: colors.surface,
            color: colors.text,
        },
        inputError: {
            borderColor: colors.dangerBorder ?? "#EF4444",
        },

        // Card de formulário genérico (como na tela de recomendação)
        formCard: {
            backgroundColor: colors.surface,
            borderColor: colors.border,
        },

        // Seção de conta (home)
        accountSection: {
            gap: 12,
            marginTop: 12,
        },
        centeredParagraph: {
            color: colors.text,
            textAlign: "center",
        },

        // Ícone do cabeçalho da Home
        headerIcon: {
            color: colors.text,
        },

        // Botões genéricos
        btnPrimary: {
            backgroundColor: colors.button ?? colors.primary ?? "#0EA5E9",
            borderWidth: 0,
            elevation: 2,
        },
        btnPrimaryText: {
            color: colors.buttonText ?? colors.onPrimary ?? "#F9FAFB",
        },
        btnSecondary: {
            backgroundColor: "transparent",
            borderWidth: 1,
            borderColor: colors.button ?? colors.primary ?? "#0EA5E9",
            elevation: 0,
        },
        btnSecondaryText: {
            color: colors.button ?? colors.primary ?? "#0EA5E9",
        },
        btnWarning: {
            backgroundColor: colors.warning ?? "#F97316",
        },
        btnWarningText: {
            color: colors.onWarning ?? "#111827",
        },
        btnDangerOutline: {
            backgroundColor: colors.background,
            borderWidth: 2,
            borderColor: colors.danger ?? "#EF4444",
            elevation: 0,
        },
        btnDangerOutlineText: {
            color: colors.danger ?? "#EF4444",
        },

        // Tiles do dashboard
        homeTileSurface: {
            backgroundColor: colors.button,
            borderColor: colors.mode === "dark" ? "#FFFFFF22" : "#00000010",
        },
        homeTilePressed: { opacity: 0.92 },
        homeTileText: {
            color: colors.buttonText ?? "#FFFFFF",
        },
        // Cor padrão dos ícones das tiles
        homeTileIcon: {
            color: colors.buttonText ?? colors.onPrimary ?? "#F9FAFB",
        },

        // Preview
        previewBackground: {
            backgroundColor: colors.background,
        },
        previewBackIcon: {
            color: colors.text,
        },
        previewBackTextColor: {
            color: colors.text,
        },
        previewHeaderActionPrimary: {
            backgroundColor: colors.button,
        },
        previewActionIcon: {
            color: colors.buttonText ?? "#FFFFFF",
        },
        previewActionTextColor: {
            color: colors.buttonText ?? "#FFFFFF",
        },
        previewLoaderSpinner: {
            color: colors.button ?? colors.primary ?? "#0EA5E9",
        },

        /* 🎯 Tela de Vagas (Jobs / Clientes / Recomendações) */
        jobsTopButtonSecondary: {
            backgroundColor: "#FFFFFF",
            borderWidth: 1,
            borderColor:
                colors.mode === "dark"
                    ? "#E5E7EB"
                    : colors.border ?? "#E5E7EB",
        },
        jobsTopButtonSecondaryText: {
            color:
                colors.mode === "dark"
                    ? "#0F172A"
                    : colors.text ?? "#111827",
        },
        jobsTopButtonPrimary: {
            backgroundColor: colors.button ?? colors.primary ?? "#0EA5E9",
        },
        jobsTopButtonPrimaryText: {
            color: colors.buttonText ?? colors.onPrimary ?? "#F9FAFB",
        },

        // Card externo que envolve a FlatList
        jobsListCard: {
            backgroundColor: colors.mode === "dark" ? "#020617" : "#FFFFFF",
            borderColor: colors.mode === "dark" ? "#1E293B" : "#E5E7EB",
        },

        // Card individual da vaga/cliente (azul escuro)
        jobsCardContainer: {
            backgroundColor: "#021B3A",
            borderColor: "#0B3255",
        },
        jobsCardTitleText: {
            color: "#F9FAFB",
        },
        jobsCardTextStrong: {
            color: "#E5E7EB",
        },
        jobsCardTextMuted: {
            color: "#CBD5F5",
        },

        // Botões dentro do card
        jobsCardEditBtn: {
            backgroundColor: "#FFFFFF",
            borderWidth: 1,
            borderColor:
                colors.mode === "dark"
                    ? "#E5E7EB"
                    : colors.border ?? "#E5E7EB",
        },
        jobsCardEditText: {
            color:
                colors.mode === "dark"
                    ? "#0F172A"
                    : colors.text ?? "#111827",
        },
        jobsCardDeleteBtn: {
            backgroundColor: "#EF4444",
            borderWidth: 1,
            borderColor: "#EF4444",
        },
        jobsCardDeleteText: {
            color: "#FEE2E2",
        },
    });
