// File: app/ia/plan-preview.tsx
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    View,
    Text,
    Pressable,
    Alert,
} from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

import { useTheme } from "../../src/context/ThemeContext";
import globalStyles, { themedStyles } from "../../src/styles/globalStyles";

export default function PlanPreviewScreen() {
    const { colors } = useTheme();
    const themeStyles = themedStyles(colors);

    const params = useLocalSearchParams<{ html?: string }>();
    const rawHtml = Array.isArray(params.html) ? params.html[0] : params.html;

    const html = rawHtml
        ? rawHtml
        : `
<html lang="pt-BR">
<head>
    <meta charSet="UTF-8" />
    <title>Plano não encontrado</title>
</head>
<body>
    <h3>Plano não encontrado</h3>
    <p>Nenhum plano foi enviado para visualização.</p>
</body>
</html>`.trim();

    const gerarPdf = async () => {
        if (!rawHtml) {
            Alert.alert(
                "PDF indisponível",
                "Nenhum plano foi encontrado para exportar."
            );
            return;
        }

        try {
            const { uri } = await Print.printToFileAsync({
                html,
                base64: false,
            });

            const sharingAvailable = await Sharing.isAvailableAsync();
            if (sharingAvailable) {
                await Sharing.shareAsync(uri, {
                    mimeType: "application/pdf",
                    dialogTitle: "Salvar ou compartilhar plano em PDF",
                });
            } else {
                Alert.alert(
                    "PDF gerado",
                    "PDF gerado com sucesso. Caminho do arquivo:\n" + uri
                );
            }
        } catch (e) {
            console.log("❌ Erro ao gerar/compartilhar PDF:", e);
            Alert.alert(
                "Erro",
                "Não foi possível gerar o PDF do plano. Tente novamente."
            );
        }
    };

    return (
        <SafeAreaView
            style={[
                globalStyles.previewContainer,
                themeStyles.previewBackground,
            ]}
        >
            <View style={globalStyles.previewBody}>
                {/* Header com voltar + ação PDF */}
                <View style={globalStyles.previewHeader}>
                    <Pressable
                        onPress={() => router.back()}
                        android_ripple={{ color: colors.ripple }}
                        style={globalStyles.previewHeaderBack}
                    >
                        <Ionicons
                            name="chevron-back"
                            size={22}
                            color={themeStyles.previewBackIcon.color}
                        />
                        <Text
                            style={[
                                globalStyles.previewBackText,
                                themeStyles.previewBackTextColor,
                            ]}
                        >
                            Voltar
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={gerarPdf}
                        android_ripple={{ color: colors.ripple }}
                        style={[
                            globalStyles.previewHeaderAction,
                            themeStyles.previewHeaderActionPrimary,
                        ]}
                    >
                        <Ionicons
                            name="download-outline"
                            size={18}
                            color={themeStyles.previewActionIcon.color}
                        />
                        <Text
                            style={[
                                globalStyles.previewActionText,
                                themeStyles.previewActionTextColor,
                            ]}
                        >
                            Gerar PDF
                        </Text>
                    </Pressable>
                </View>

                {/* Conteúdo / WebView */}
                <WebView
                    style={globalStyles.webViewFull}
                    originWhitelist={["*"]}
                    source={{ html }}
                />
            </View>
        </SafeAreaView>
    );
}
