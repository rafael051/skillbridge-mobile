// File: src/components/ThemeToggleButton.jsx
import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { useTheme } from "../context/ThemeContext";
import globalStyles from "../styles/globalStyles";

/* ============================================================
🔘 ThemeToggleButton — SkillBridge Mobile
------------------------------------------------------------
Botão para alternar entre temas (claro/escuro).

- Estilos fixos → globalStyles.button / buttonText
- Cores dinâmicas → ThemeContext (colors)

📌 Uso:
<ThemeToggleButton />
============================================================ */

export default function ThemeToggleButton() {
    const { toggleTheme, colors, theme } = useTheme();

    const label =
        theme === "light" ? "Ativar modo escuro" : "Ativar modo claro";

    return (
        <TouchableOpacity
            style={[
                globalStyles.button,
                {
                    backgroundColor: colors.buttonSecondary || colors.button,
                    borderWidth: 1,
                    borderColor: colors.border,
                },
            ]}
            onPress={toggleTheme}
            activeOpacity={0.9}
        >
            <Text
                style={[
                    globalStyles.buttonText,
                    { color: colors.buttonSecondaryText || colors.buttonText },
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
}
