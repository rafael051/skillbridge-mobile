// File: app/ia/explain-preview.tsx
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    ActivityIndicator,
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

export default function ExplainPreviewScreen() {
    const { colors } = useTheme();
    const themeStyles = themedStyles(colors);

    const params = useLocalSearchParams<{ html?: string }>();
    const rawHtml = Array.isArray(params.html) ? params.html[0] : params.html;

    const html = rawHtml
        ? rawHtml
        : "<html><body><h3>Explicação não encontrada</h3></body></html>";

    const gerarPdf = async () => {
        if (!rawHtml) {
            Alert.alert(
                "PDF indisponível",
                "Nenhuma explicação foi encontrada para exportar."
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
                    dialogTitle: "Salvar ou compartilhar explicação em PDF",
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
                "Não foi possível gerar o PDF da explicação. Tente novamente."
            );
        }
    };

    const loaderColor =
        colors.button ?? colors.primary ?? "#0EA5E9";

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
                                globalStyles.text,
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
                                globalStyles.buttonText,
                                globalStyles.previewActionText,
                                themeStyles.previewActionTextColor,
                            ]}
                        >
                            Gerar PDF
                        </Text>
                    </Pressable>
                </View>

                {/* Conteúdo / WebView */}
                {!rawHtml ? (
                    <View style={globalStyles.previewLoader}>
                        <ActivityIndicator
                            size="large"
                            color={loaderColor}
                        />
                    </View>
                ) : (
                    <WebView
                        style={globalStyles.webViewFull}
                        originWhitelist={["*"]}
                        source={{ html }}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}
