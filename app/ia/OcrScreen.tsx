// File: app/OcrScreen.tsx
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    View,
    Text,
    TextInput,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
} from "react-native";
import { useTheme } from "../../src/context/ThemeContext";
import globalStyles, { formStyles, listStyles } from "../../src/styles/globalStyles";
import ThemeToggleButton from "../../src/components/ThemeToggleButton";

/* ============================================================================
   Utils simples
   ============================================================================ */
const sanitize = (t: string) => (t ?? "").replace(/[“”"']/g, "").trim();

/* ============================================================================
   OcrScreen – formulário para montar dados do pedido de OCR
   (sem i18n / sem API por enquanto)
   ============================================================================ */
export default function OcrScreen() {
    const { colors } = useTheme();

    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    const [fieldErrors, setFieldErrors] = useState<{
        tipoDocumento?: string;
        origem?: string;
        idioma?: string;
    }>({});

    const [form, setForm] = useState<{
        tipoDocumento: string;
        origem: string;
        idioma: string;
        notaContexto: string;
        textoBruto: string;
    }>({
        tipoDocumento: "crlv",
        origem: "",
        idioma: "pt-BR",
        notaContexto: "",
        textoBruto: "",
    });

    const tituloPagina = "🧾 OCR de Documentos";

    /* ============================================================================
       "Enviar" para OCR (validação + Alert; no futuro chama API /ocr)
       ============================================================================ */
    const enviarOcr = async () => {
        setFieldErrors({});
        setErro(null);

        const tipoDocumento = sanitize(form.tipoDocumento);
        const origem = sanitize(form.origem);
        const idioma = sanitize(form.idioma) || "pt-BR";
        const notaContexto = sanitize(form.notaContexto);
        const textoBruto = sanitize(form.textoBruto);

        const newErrors: typeof fieldErrors = {};
        let hasError = false;

        if (!tipoDocumento) {
            newErrors.tipoDocumento =
                'Informe o tipo de documento (ex.: "crlv", "curriculo", "outro").';
            hasError = true;
        }

        // Pelo menos uma forma de entrada: origem (URL/caminho) ou textoBruto
        if (!origem && !textoBruto) {
            newErrors.origem =
                "Informe a origem da imagem/PDF ou cole o texto bruto para tratamento.";
            hasError = true;
        }

        if (!idioma) {
            newErrors.idioma = "Informe o idioma esperado para o resultado (ex.: pt-BR).";
            hasError = true;
        }

        if (hasError) {
            setFieldErrors(newErrors);
            const firstErrorMsg =
                newErrors.tipoDocumento ||
                newErrors.origem ||
                newErrors.idioma ||
                "Revise os campos destacados.";
            Alert.alert("Validação", firstErrorMsg);
            return;
        }

        setSalvando(true);
        try {
            const payload = {
                idioma,
                tipoDocumento,
                origem: origem
                    ? {
                        tipo: "url_ou_caminho", // futuro: "url", "file", etc.
                        valor: origem,
                    }
                    : undefined,
                contexto: {
                    nota: notaContexto || undefined,
                },
                textoBruto: textoBruto || undefined,
            };

            console.log("OCR payload (simulado):", payload);

            // 👉 FUTURO: aqui você chama a API /ocr do SkillBridge-cloud
            Alert.alert(
                "OCR estruturado",
                "Simulação: os dados do pedido de OCR foram montados. No próximo passo vamos integrar com a API."
            );
        } catch (e: any) {
            const msg = e?.message ?? "Falha ao preparar dados para OCR.";
            setErro(msg);
            Alert.alert("Erro", msg);
        } finally {
            setSalvando(false);
        }
    };

    const limpar = () => {
        setForm({
            tipoDocumento: "crlv",
            origem: "",
            idioma: "pt-BR",
            notaContexto: "",
            textoBruto: "",
        });
        setFieldErrors({});
        setErro(null);
    };

    /* ============================================================================
       Render
       ============================================================================ */
    return (
        <SafeAreaView
            style={[globalStyles.container, { backgroundColor: colors.background }]}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView>

                    {/* Título */}
                    <Text style={[globalStyles.title, { color: colors.text }]}>
                        {tituloPagina}
                    </Text>
                    <Text
                        style={[
                            globalStyles.text,
                            { color: colors.mutedText, textAlign: "center" },
                        ]}
                    >
                        Preencha os dados abaixo para enviar um documento à API de OCR
                        (simulação).
                    </Text>

                    {/* Card do formulário */}
                    <View
                        style={[
                            formStyles.card,
                            {
                                backgroundColor: colors.surface,
                                borderColor: colors.border,
                            },
                        ]}
                    >
                        {!!erro && (
                            <Text
                                style={[
                                    globalStyles.text,
                                    { color: colors.dangerBorder, marginBottom: 8 },
                                ]}
                            >
                                {erro}
                            </Text>
                        )}

                        {/* Tipo de documento */}
                        <View style={globalStyles.inputContainer}>
                            <Text
                                style={[
                                    globalStyles.inputLabel,
                                    { color: colors.mutedText },
                                ]}
                            >
                                Tipo de documento
                            </Text>
                            <TextInput
                                placeholder='Ex.: "crlv", "curriculo", "outro"...'
                                placeholderTextColor={colors.mutedText}
                                value={form.tipoDocumento}
                                onChangeText={(v) =>
                                    setForm((s) => ({ ...s, tipoDocumento: v }))
                                }
                                editable={!salvando}
                                style={[
                                    globalStyles.input,
                                    {
                                        borderColor: fieldErrors.tipoDocumento
                                            ? colors.dangerBorder
                                            : colors.border,
                                        color: colors.text,
                                        backgroundColor: colors.surface,
                                    },
                                ]}
                            />
                            {!!fieldErrors.tipoDocumento && (
                                <Text
                                    style={[
                                        globalStyles.text,
                                        { color: colors.dangerBorder },
                                    ]}
                                >
                                    {fieldErrors.tipoDocumento}
                                </Text>
                            )}
                        </View>

                        {/* Origem da imagem/PDF */}
                        <View style={globalStyles.inputContainer}>
                            <Text
                                style={[
                                    globalStyles.inputLabel,
                                    { color: colors.mutedText },
                                ]}
                            >
                                Origem da imagem/PDF
                            </Text>
                            <TextInput
                                placeholder="URL pública, caminho no servidor ou identificação do arquivo (futuro)."
                                placeholderTextColor={colors.mutedText}
                                value={form.origem}
                                onChangeText={(v) =>
                                    setForm((s) => ({ ...s, origem: v }))
                                }
                                editable={!salvando}
                                multiline
                                numberOfLines={2}
                                style={[
                                    globalStyles.input,
                                    {
                                        borderColor: fieldErrors.origem
                                            ? colors.dangerBorder
                                            : colors.border,
                                        color: colors.text,
                                        backgroundColor: colors.surface,
                                        height: 70,
                                        textAlignVertical: "top",
                                    },
                                ]}
                            />
                            {!!fieldErrors.origem && (
                                <Text
                                    style={[
                                        globalStyles.text,
                                        { color: colors.dangerBorder },
                                    ]}
                                >
                                    {fieldErrors.origem}
                                </Text>
                            )}
                        </View>

                        {/* Idioma */}
                        <View style={globalStyles.inputContainer}>
                            <Text
                                style={[
                                    globalStyles.inputLabel,
                                    { color: colors.mutedText },
                                ]}
                            >
                                Idioma esperado do resultado
                            </Text>
                            <TextInput
                                placeholder='Ex.: "pt-BR", "en-US"...'
                                placeholderTextColor={colors.mutedText}
                                value={form.idioma}
                                onChangeText={(v) =>
                                    setForm((s) => ({ ...s, idioma: v }))
                                }
                                editable={!salvando}
                                style={[
                                    globalStyles.input,
                                    {
                                        borderColor: fieldErrors.idioma
                                            ? colors.dangerBorder
                                            : colors.border,
                                        color: colors.text,
                                        backgroundColor: colors.surface,
                                    },
                                ]}
                            />
                            {!!fieldErrors.idioma && (
                                <Text
                                    style={[
                                        globalStyles.text,
                                        { color: colors.dangerBorder },
                                    ]}
                                >
                                    {fieldErrors.idioma}
                                </Text>
                            )}
                        </View>

                        {/* Nota de contexto (opcional) */}
                        <View style={globalStyles.inputContainer}>
                            <Text
                                style={[
                                    globalStyles.inputLabel,
                                    { color: colors.mutedText },
                                ]}
                            >
                                Nota de contexto (opcional)
                            </Text>
                            <TextInput
                                placeholder="Ex.: Documento CRLV de veículo Ford Ka 2020; extrair placa, RENAVAM, nome do proprietário..."
                                placeholderTextColor={colors.mutedText}
                                value={form.notaContexto}
                                onChangeText={(v) =>
                                    setForm((s) => ({ ...s, notaContexto: v }))
                                }
                                editable={!salvando}
                                multiline
                                numberOfLines={3}
                                style={[
                                    globalStyles.input,
                                    {
                                        color: colors.text,
                                        backgroundColor: colors.surface,
                                        height: 90,
                                        textAlignVertical: "top",
                                    },
                                ]}
                            />
                        </View>

                        {/* Texto bruto (opcional, mas usado se não tiver origem) */}
                        <View style={globalStyles.inputContainer}>
                            <Text
                                style={[
                                    globalStyles.inputLabel,
                                    { color: colors.mutedText },
                                ]}
                            >
                                Texto bruto (opcional)
                            </Text>
                            <TextInput
                                placeholder="Cole aqui o texto já extraído por outro OCR, caso queira apenas normalizar / estruturar."
                                placeholderTextColor={colors.mutedText}
                                value={form.textoBruto}
                                onChangeText={(v) =>
                                    setForm((s) => ({ ...s, textoBruto: v }))
                                }
                                editable={!salvando}
                                multiline
                                numberOfLines={4}
                                style={[
                                    globalStyles.input,
                                    {
                                        color: colors.text,
                                        backgroundColor: colors.surface,
                                        height: 110,
                                        textAlignVertical: "top",
                                    },
                                ]}
                            />
                        </View>

                        {/* Ações */}
                        <View style={listStyles.row}>
                            <Pressable
                                accessibilityRole="button"
                                accessibilityLabel="Preparar requisição de OCR"
                                accessibilityHint="Valida os dados e monta o payload para a API de OCR."
                                android_ripple={{ color: colors.ripple }}
                                disabled={salvando}
                                style={[
                                    globalStyles.button,
                                    { backgroundColor: colors.button },
                                ]}
                                onPress={enviarOcr}
                            >
                                <Text
                                    style={[
                                        globalStyles.buttonText,
                                        { color: colors.buttonText },
                                    ]}
                                >
                                    {salvando
                                        ? "Processando..."
                                        : "Preparar OCR"}
                                </Text>
                            </Pressable>

                            <Pressable
                                accessibilityRole="button"
                                accessibilityLabel="Limpar campos"
                                android_ripple={{ color: colors.ripple }}
                                style={[
                                    globalStyles.button,
                                    {
                                        backgroundColor: colors.surface,
                                        borderWidth: 1,
                                        borderColor: colors.border,
                                    },
                                ]}
                                onPress={limpar}
                            >
                                <Text
                                    style={[
                                        globalStyles.buttonText,
                                        { color: colors.text },
                                    ]}
                                >
                                    Limpar
                                </Text>
                            </Pressable>
                        </View>
                    </View>

                    {/* Rodapé - Alternar tema */}
                    <View style={globalStyles.homeFooter}>
                        <ThemeToggleButton />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
