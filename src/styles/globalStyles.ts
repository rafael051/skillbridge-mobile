import { StyleSheet, TextStyle, ViewStyle } from "react-native";

/* ============================================================
🎨 Global Styles — SkillBridge Mobile
------------------------------------------------------------
Centraliza estilos reutilizáveis do app.
============================================================ */

// Tipagem explícita dos estilos principais
interface GlobalStyles {
    hintText: TextStyle;
    container: ViewStyle;
    inputContainer: ViewStyle;
    inputLabel: TextStyle;
    input: TextStyle & ViewStyle;
    button: ViewStyle;
    buttonText: TextStyle;

    title: TextStyle;
    subtitle: TextStyle;     // ✅ ADICIONADO
    text: TextStyle;

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
    homeHeader: ViewStyle;
    homeStatusRow: ViewStyle;
    homeStatusDot: ViewStyle;
    homeLinkBtn: ViewStyle;
    homeCardsWrap: ViewStyle;
    homeCard: ViewStyle;
    homeFooter: ViewStyle;

    homeGrid: ViewStyle;
    homeTile: ViewStyle;
    homeTileIconWrap: ViewStyle;
    homeTileCount: TextStyle;
    homeTileLabel: TextStyle;
}

const globalStyles = StyleSheet.create<GlobalStyles>({
    // ============================
    // 📦 Containers
    // ============================
    container: {
        flex: 1,
        padding: 24,
        justifyContent: "center",
    },
    authContainer: {
        width: "100%",
        maxWidth: 380,
        alignSelf: "center",
    },

    // ============================
    // ✏️ Inputs
    // ============================
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

    // ============================
    // 🔘 Botões
    // ============================
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

    // ============================
    // 🌐 Botões de idioma
    // ============================
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

    // ============================
    // 🔤 Tipografia
    // ============================
    title: {
        fontSize: 26,
        fontWeight: "700",
        marginBottom: 20,
        textAlign: "center",
    },

    subtitle: {              // ✅ ADICIONADO
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

    // ============================
    // 🃏 Cards
    // ============================
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

    // ============================
    // 📑 Headers
    // ============================
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

    // ============================
    // 🌐 Auxiliares
    // ============================
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

    // ============================
    // 🏠 Home (Dashboard)
    // ============================
    homeContainer: { flex: 1, paddingHorizontal: 16, gap: 12 },
    homeHeader: { marginTop: 12, gap: 4 },
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

    // ============================
    // 🟥 Grid e Tiles
    // ============================
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

    hintText: {
        fontSize: 12,
        lineHeight: 18,
        marginTop: 6,
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
        gap: 12,
        flexWrap: "wrap",
    },
    cardOutlined: {
        padding: 18,
        borderRadius: 16,
        borderWidth: 1,
    },
    rowItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: 14,
        borderWidth: 1,
        borderRadius: 12,
    },
    smallBtn: {
        minHeight: 40,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    smallBtnDanger: {
        minHeight: 40,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
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
        errorText: {
            color: colors.error ?? "#FB7185",
            marginTop: 8,
        },
        accountSection: {
            gap: 12,
            marginTop: 12,
        },
        centeredParagraph: {
            color: colors.text,
            textAlign: "center",
        },

        btnPrimary: {
            backgroundColor: colors.primary ?? "#0EA5E9",
            borderWidth: 0,
            elevation: 2,
        },
        btnPrimaryText: {
            color: colors.onPrimary ?? "#0F172A",
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

        homeTileSurface: {
            backgroundColor: colors.button,
            borderColor: colors.mode === "dark" ? "#FFFFFF22" : "#00000010",
        },
        homeTilePressed: { opacity: 0.92 },
        homeTileText: {
            color: colors.buttonText ?? "#FFFFFF",
        },
    });
