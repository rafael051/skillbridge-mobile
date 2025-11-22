// File: app/cv-preview.tsx
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
import globalStyles from "../../src/styles/globalStyles";

export default function CvPreviewScreen() {
    const { colors } = useTheme();

    const params = useLocalSearchParams<{ html?: string }>();
    const rawHtml = Array.isArray(params.html) ? params.html[0] : params.html;

    const html = rawHtml
        ? rawHtml
        : "<html><body><h3>Currículo não encontrado</h3></body></html>";

    const gerarPdf = async () => {
        if (!rawHtml) {
            Alert.alert(
                "PDF indisponível",
                "Nenhum currículo foi encontrado para exportar."
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
                    dialogTitle: "Salvar ou compartilhar currículo em PDF",
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
                "Não foi possível gerar o PDF do currículo. Tente novamente."
            );
        }
    };

    return (
        <SafeAreaView
            style={[
                globalStyles.previewContainer,
                { backgroundColor: colors.background },
            ]}
        >
            <View style={{ flex: 1 }}>
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
                            color={colors.text}
                        />
                        <Text
                            style={[
                                globalStyles.text,
                                { marginLeft: 2, color: colors.text },
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
                            { backgroundColor: colors.button },
                        ]}
                    >
                        <Ionicons
                            name="download-outline"
                            size={18}
                            color={colors.buttonText ?? "#fff"}
                        />
                        <Text
                            style={[
                                globalStyles.buttonText,
                                {
                                    marginLeft: 6,
                                    fontSize: 14,
                                    color: colors.buttonText ?? "#fff",
                                },
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
                            color={colors.button ?? colors.primary ?? "#0EA5E9"}
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
