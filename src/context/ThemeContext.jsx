import React, { createContext, useContext, useState } from "react";
import { Appearance } from "react-native";

/* ============================================================
🎨 ThemeContext — SkillBridge Mobile
------------------------------------------------------------
Gerencia o tema global da aplicação (claro/escuro).

📌 Estrutura:
- Contexto: ThemeContext
- Hook: useTheme() → acesso prático ao tema
- Provider: ThemeProvider → envolve a aplicação

⚡ Recursos:
- Detecta o tema do dispositivo (Appearance)
- Permite alternar manualmente (toggleTheme)
- Fornece paletas de cores específicas para cada tema
============================================================ */

// 🏗️ Criando o contexto global de tema
const ThemeContext = createContext();

/* ============================================================
🧩 Hook customizado: useTheme
------------------------------------------------------------ */
export function useTheme() {
    return useContext(ThemeContext);
}

/* ============================================================
🌍 ThemeProvider
------------------------------------------------------------ */
export default function ThemeProvider({ children }) {
    // 🎨 Detecta automaticamente o tema do sistema (light/dark)
    const colorScheme = Appearance.getColorScheme();

    // 🗂️ Estado que armazena o tema atual
    const [theme, setTheme] = useState(colorScheme || "light");

    // 🔄 Alterna manualmente entre claro e escuro
    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    /* ============================================================
    🌈 Paletas de cores por tema
    ------------------------------------------------------------ */
    const themeColors = {
        light: {
            // Metadados do tema
            scheme: "light",
            mode: "light",

            // Fundo geral em tom mais “lavanda/azulado”
            background: "#F4F4FF",
            surface: "#FFFFFF",
            text: "#020617",

            // Botão principal: azul claro
            button: "#0EA5E9",
            buttonText: "#FFFFFF",

            // Botão secundário: laranja
            buttonSecondary: "#F97316",
            buttonSecondaryText: "#111827",

            // Acento roxo-azulado
            accent: "#6366F1",

            border: "#E2E8F0",
            mutedText: "#64748B",

            // Cores usadas pelo themedStyles (fallbacks)
            primary: "#0EA5E9",
            onPrimary: "#0F172A",
            warning: "#F97316",
            onWarning: "#111827",
            danger: "#EF4444",

            // Mantidos para compatibilidade (idiomas, se usar)
            langEnBg: "#0EA5E9",
            langEnText: "#FFFFFF",
            langPtBg: "#6366F1",
            langPtText: "#FFFFFF",
            langEsBg: "#F97316",
            langEsText: "#FFFFFF",

            ripple: "rgba(15, 23, 42, 0.08)",
            dangerBg: "#F97373",
            dangerBorder: "#B91C1C",
        },
        dark: {
            // Metadados do tema
            scheme: "dark",
            mode: "dark",

            // Fundo bem escuro em azul marinho
            background: "#020617",
            surface: "#0F172A",
            text: "#E5E7EB",

            // Botão principal: ciano/azul claro
            button: "#22D3EE",
            buttonText: "#0F172A",

            // Botão secundário: laranja suave
            buttonSecondary: "#FDBA74",
            buttonSecondaryText: "#111827",

            // Acento roxo
            accent: "#A855F7",

            border: "#334155",
            mutedText: "#9CA3AF",

            // Cores usadas pelo themedStyles (fallbacks)
            primary: "#22D3EE",
            onPrimary: "#0F172A",
            warning: "#FDBA74",
            onWarning: "#111827",
            danger: "#F97373",

            // Mantidos para compatibilidade
            langEnBg: "#22D3EE",
            langEnText: "#0F172A",
            langPtBg: "#A855F7",
            langPtText: "#FFFFFF",
            langEsBg: "#FB923C",
            langEsText: "#111827",

            ripple: "rgba(248, 250, 252, 0.12)",
            dangerBg: "#450A0A",
            dangerBorder: "#FCA5A5",
        },
    };

    const value = {
        theme,
        toggleTheme,
        colors: themeColors[theme],
    };

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
}
