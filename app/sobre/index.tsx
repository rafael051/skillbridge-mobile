// File: app/sobre/index.tsx
import React, { JSX } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, View, Text, Pressable } from "react-native";
import { router } from "expo-router";

import globalStyles, { themedStyles } from "../../src/styles/globalStyles";
import { useTheme } from "../../src/context/ThemeContext";
import ThemeToggleButton from "../../src/components/ThemeToggleButton";

/**
 * Tela "Sobre o App"
 * Exibe o hash do commit de referência exigido pela FIAP.
 */
export default function SobreScreen(): JSX.Element {
    const { colors } = useTheme();
    const themeStyles = themedStyles(colors);

    // ⚠️ Atualize com o hash real do commit publicado
    const COMMIT_HASH = "COLOQUE_O_HASH_AQUI";

    return (
        <SafeAreaView
            style={[
                globalStyles.previewContainer,
                themeStyles.previewBackground,
            ]}
        >
            {/* Header com botão Voltar e título, usando globalStyles */}
            <View style={globalStyles.previewHeader}>
                <Pressable
                    style={globalStyles.previewHeaderBack}
                    onPress={() => router.back()}
                >
                    <Text
                        style={[
                            globalStyles.previewBackText,
                            themeStyles.previewBackTextColor,
                        ]}
                    >
                        ◀ Voltar
                    </Text>
                </Pressable>

                <Text
                    style={[
                        globalStyles.headerTitle,
                        themeStyles.titleText,
                    ]}
                >
                    Sobre o App
                </Text>

                {/* Espaço à direita para balancear o header */}
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                contentContainerStyle={[
                    globalStyles.container,
                    globalStyles.screenTop, // força conteúdo no topo
                ]}
            >
                {/* Botão de tema claro/escuro */}
                <ThemeToggleButton />

                <Text
                    style={[
                        globalStyles.title,
                        { color: colors.text, marginTop: 24 },
                    ]}
                >
                    📘 Sobre o SkillBridge Mobile
                </Text>

                <Text
                    style={[
                        globalStyles.text,
                        { color: colors.text, marginTop: 12, lineHeight: 22 },
                    ]}
                >
                    Este aplicativo foi desenvolvido como parte da Global
                    Solution, integrando autenticação, CRUD completo, navegação
                    com Expo Router e integração total com a API SkillBridge
                    (.NET/Java).
                </Text>

                <Text
                    style={[
                        globalStyles.subtitle,
                        { color: colors.text, marginTop: 24 },
                    ]}
                >
                    🔐 Hash do Commit de Referência
                </Text>

                <Text
                    style={[
                        globalStyles.text,
                        {
                            color: colors.text,
                            marginTop: 4,
                            fontWeight: "bold",
                            letterSpacing: 1,
                        },
                    ]}
                >
                    {COMMIT_HASH}
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}
