// File: app/ia/ExplainScreen.tsx
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
import { router } from "expo-router";
import { useTheme } from "../../src/context/ThemeContext";
import globalStyles, {
    formStyles,
    listStyles,
    themedStyles,
} from "../../src/styles/globalStyles";
import ThemeToggleButton from "../../src/components/ThemeToggleButton";

import {
    SkillBridgeIA,
    type ExplainRequest,
    type ExplainHtmlResponse,
} from "../../src/services/skillbridgeAiApi";

/* ============================================================================
// Utils simples
============================================================================ */
const sanitize = (t?: string) => (t ?? "").replace(/[“”"']/g, "").trim();

/* ============================================================================
// ExplainScreen – formulário para montar dados da explicação humanizada
// (integrado com /gen/explain/html)
============================================================================ */
export default function ExplainScreen() {
    const { colors } = useTheme();
    const themeStyles = themedStyles(colors);

    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [htmlGerado, setHtmlGerado] = useState<string | null>(null);

    const [fieldErrors, setFieldErrors] = useState<{
        idioma?: string;
        tipo?: string;
        resumo?: string;
        nome?: string;
        objetivo?: string;
    }>({});

    const [form, setForm] = useState<{
        idioma: string;
        tipo: string;
        resumo: string;
        nome: string;
        objetivo: string;
        dadosExtras: string;
    }>({
        idioma: "pt-BR",
        tipo: "plano_requalificacao",
        resumo: "",
        nome: "",
        objetivo: "",
        dadosExtras: "",
    });

    const tituloPagina = "🧠 Explicação Humanizada (Coach)";

    /* ========================================================================
       Gerar explicação chamando a API /gen/explain/html
       ===================================================================== */
    const gerarExplicacao = async () => {
        setFieldErrors({});
        setErro(null);
        setHtmlGerado(null);

        const idioma = sanitize(form.idioma) || "pt-BR";
        const tipo = sanitize(form.tipo);
        const resumo = sanitize(form.resumo);
        const nome = sanitize(form.nome);
        const objetivo = sanitize(form.objetivo);
        const dadosExtras = sanitize(form.dadosExtras);

        const newErrors: typeof fieldErrors = {};
        let hasError = false;

        if (!idioma) {
            newErrors.idioma = "Informe o idioma (ex.: pt-BR, en-US).";
            hasError = true;
        }

        if (!tipo) {
            newErrors.tipo =
                'Informe o tipo de contexto (ex.: "plano_requalificacao").';
            hasError = true;
        }

        if (!resumo || resumo.length < 10) {
            newErrors.resumo =
                "Faça um breve resumo do contexto (mínimo 10 caracteres).";
            hasError = true;
        }

        if (!nome || nome.length < 2) {
            newErrors.nome = "Informe o nome da pessoa.";
            hasError = true;
        }

        if (!objetivo || objetivo.length < 5) {
            newErrors.objetivo =
                "Descreva o objetivo da pessoa (mínimo 5 caracteres).";
            hasError = true;
        }

        if (hasError) {
            setFieldErrors(newErrors);
            const firstErrorMsg =
                newErrors.idioma ||
                newErrors.tipo ||
                newErrors.resumo ||
                newErrors.nome ||
                newErrors.objetivo ||
                "Revise os campos destacados.";
            Alert.alert("Validação", firstErrorMsg);
            return;
        }

        setSalvando(true);
        try {
            const payload: ExplainRequest = {
                idioma,
                contexto: {
                    tipo,
                    resumo,
                    perfil: {
                        nome,
                        objetivo,
                        dadosExtras: dadosExtras || undefined,
                    },
                },
            };

            console.log("📨 Enviando para /gen/explain/html:", payload);

            const resp: ExplainHtmlResponse =
                await SkillBridgeIA.gerarExplainHtml(payload);

            console.log("✅ Resposta /gen/explain/html (string HTML):", resp);

            const html = resp || "";
            setHtmlGerado(html);

            // 👉 Redireciona automaticamente para o preview
            router.push({
                pathname: "/ia/explain-preview",
                params: { html },
            });

            Alert.alert(
                "Explicação gerada",
                "A explicação foi gerada e aberta em tela cheia."
            );
        } catch (e: any) {
            const msg =
                e?.response?.data?.detail ||
                e?.message ||
                "Falha ao gerar a explicação na API.";
            console.log("❌ Erro ao chamar /gen/explain/html:", e);
            setErro(msg);
            Alert.alert("Erro", msg);
        } finally {
            setSalvando(false);
        }
    };

    const limpar = () => {
        setForm({
            idioma: "pt-BR",
            tipo: "plano_requalificacao",
            resumo: "",
            nome: "",
            objetivo: "",
            dadosExtras: "",
        });
        setFieldErrors({});
        setErro(null);
        setHtmlGerado(null);
    };

    /* ========================================================================
       Abrir preview em tela cheia (WebView em /ia/explain-preview)
       ===================================================================== */
    const abrirPreview = () => {
        if (!htmlGerado) {
            Alert.alert(
                "Prévia indisponível",
                "Gere a explicação antes de abrir a visualização."
            );
            return;
        }

        router.push({
            pathname: "/ia/explain-preview",
            params: { html: htmlGerado },
        });
    };

    /* ========================================================================
       Render
       ===================================================================== */
    return (
        <SafeAreaView
            style={[
                globalStyles.screenFill,
                { backgroundColor: colors.background },
            ]}
        >
            <KeyboardAvoidingView
                style={globalStyles.screenFill}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    contentContainerStyle={[
                        globalStyles.screenTop,
                        { paddingHorizontal: 24, paddingBottom: 24 },
                    ]}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header: Voltar + tema */}
                    <View style={{ marginBottom: 12 }}>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: 8,
                            }}
                        >
                            <Pressable
                                accessibilityRole="button"
                                accessibilityLabel="Voltar para a tela anterior"
                                android_ripple={{ color: colors.ripple }}
                                onPress={() => router.back()}
                                style={[
                                    globalStyles.button,
                                    themeStyles.btnSecondary,
                                    {
                                        alignSelf: "flex-start",
                                        paddingHorizontal: 18,
                                        marginVertical: 0,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        globalStyles.buttonText,
                                        themeStyles.btnSecondaryText,
                                    ]}
                                >
                                    ← Voltar
                                </Text>
                            </Pressable>

                            <ThemeToggleButton />
                        </View>

                        <Text
                            style={[
                                globalStyles.title,
                                { color: colors.text, marginBottom: 4 },
                            ]}
                        >
                            {tituloPagina}
                        </Text>
                        <Text
                            style={[
                                globalStyles.text,
                                {
                                    color: colors.mutedText,
                                    textAlign: "center",
                                },
                            ]}
                        >
                            Preencha os dados abaixo para gerar uma explicação
                            humanizada (coach) baseada no perfil da pessoa.
                        </Text>
                    </View>

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

                        {/* Idioma */}
                        <View style={globalStyles.inputContainer}>
                            <Text
                                style={[
                                    globalStyles.inputLabel,
                                    { color: colors.mutedText },
                                ]}
                            >
                                Idioma da resposta
                            </Text>
                            <TextInput
                                placeholder='Ex.: "pt-BR" ou "es-ES"'
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

                        {/* Tipo de contexto */}
                        <View style={globalStyles.inputContainer}>
                            <Text
                                style={[
                                    globalStyles.inputLabel,
                                    { color: colors.mutedText },
                                ]}
                            >
                                Tipo de contexto
                            </Text>
                            <TextInput
                                placeholder='Ex.: "plano_requalificacao", "feedback_curriculo"...'
                                placeholderTextColor={colors.mutedText}
                                value={form.tipo}
                                onChangeText={(v) =>
                                    setForm((s) => ({ ...s, tipo: v }))
                                }
                                editable={!salvando}
                                style={[
                                    globalStyles.input,
                                    {
                                        borderColor: fieldErrors.tipo
                                            ? colors.dangerBorder
                                            : colors.border,
                                        color: colors.text,
                                        backgroundColor: colors.surface,
                                    },
                                ]}
                            />
                            {!!fieldErrors.tipo && (
                                <Text
                                    style={[
                                        globalStyles.text,
                                        { color: colors.dangerBorder },
                                    ]}
                                >
                                    {fieldErrors.tipo}
                                </Text>
                            )}
                        </View>

                        {/* Resumo do contexto */}
                        <View style={globalStyles.inputContainer}>
                            <Text
                                style={[
                                    globalStyles.inputLabel,
                                    { color: colors.mutedText },
                                ]}
                            >
                                Resumo do contexto
                            </Text>
                            <TextInput
                                placeholder="Ex.: Plano foca em lógica de programação e desenvolvimento web, para migração de suporte para dev."
                                placeholderTextColor={colors.mutedText}
                                value={form.resumo}
                                onChangeText={(v) =>
                                    setForm((s) => ({ ...s, resumo: v }))
                                }
                                editable={!salvando}
                                multiline
                                numberOfLines={4}
                                style={[
                                    globalStyles.input,
                                    {
                                        borderColor: fieldErrors.resumo
                                            ? colors.dangerBorder
                                            : colors.border,
                                        color: colors.text,
                                        backgroundColor: colors.surface,
                                        height: 100,
                                        textAlignVertical: "top",
                                    },
                                ]}
                            />
                            {!!fieldErrors.resumo && (
                                <Text
                                    style={[
                                        globalStyles.text,
                                        { color: colors.dangerBorder },
                                    ]}
                                >
                                    {fieldErrors.resumo}
                                </Text>
                            )}
                        </View>

                        {/* Nome da pessoa */}
                        <View style={globalStyles.inputContainer}>
                            <Text
                                style={[
                                    globalStyles.inputLabel,
                                    { color: colors.mutedText },
                                ]}
                            >
                                Nome da pessoa
                            </Text>
                            <TextInput
                                placeholder="Ex.: Rafael"
                                placeholderTextColor={colors.mutedText}
                                value={form.nome}
                                onChangeText={(v) =>
                                    setForm((s) => ({ ...s, nome: v }))
                                }
                                editable={!salvando}
                                style={[
                                    globalStyles.input,
                                    {
                                        borderColor: fieldErrors.nome
                                            ? colors.dangerBorder
                                            : colors.border,
                                        color: colors.text,
                                        backgroundColor: colors.surface,
                                    },
                                ]}
                            />
                            {!!fieldErrors.nome && (
                                <Text
                                    style={[
                                        globalStyles.text,
                                        { color: colors.dangerBorder },
                                    ]}
                                >
                                    {fieldErrors.nome}
                                </Text>
                            )}
                        </View>

                        {/* Objetivo da pessoa */}
                        <View style={globalStyles.inputContainer}>
                            <Text
                                style={[
                                    globalStyles.inputLabel,
                                    { color: colors.mutedText },
                                ]}
                            >
                                Objetivo da pessoa
                            </Text>
                            <TextInput
                                placeholder="Ex.: Migrar de suporte técnico para desenvolvimento de software."
                                placeholderTextColor={colors.mutedText}
                                value={form.objetivo}
                                onChangeText={(v) =>
                                    setForm((s) => ({ ...s, objetivo: v }))
                                }
                                editable={!salvando}
                                multiline
                                numberOfLines={3}
                                style={[
                                    globalStyles.input,
                                    {
                                        borderColor: fieldErrors.objetivo
                                            ? colors.dangerBorder
                                            : colors.border,
                                        color: colors.text,
                                        backgroundColor: colors.surface,
                                        height: 80,
                                        textAlignVertical: "top",
                                    },
                                ]}
                            />
                            {!!fieldErrors.objetivo && (
                                <Text
                                    style={[
                                        globalStyles.text,
                                        { color: colors.dangerBorder },
                                    ]}
                                >
                                    {fieldErrors.objetivo}
                                </Text>
                            )}
                        </View>

                        {/* Dados extras opcionais */}
                        <View style={globalStyles.inputContainer}>
                            <Text
                                style={[
                                    globalStyles.inputLabel,
                                    { color: colors.mutedText },
                                ]}
                            >
                                Dados extras (opcional)
                            </Text>
                            <TextInput
                                placeholder="Ex.: nível atual de conhecimento, disponibilidade de tempo, preferências de estudo..."
                                placeholderTextColor={colors.mutedText}
                                value={form.dadosExtras}
                                onChangeText={(v) =>
                                    setForm((s) => ({ ...s, dadosExtras: v }))
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

                        {/* Ações */}
                        <View style={listStyles.row}>
                            <Pressable
                                accessibilityRole="button"
                                accessibilityLabel="Gerar explicação humanizada"
                                accessibilityHint="Valida os dados e envia para a API de explicação."
                                android_ripple={{ color: colors.ripple }}
                                disabled={salvando}
                                style={[
                                    globalStyles.button,
                                    listStyles.rowButton,
                                    themeStyles.btnPrimary,
                                ]}
                                onPress={gerarExplicacao}
                            >
                                <Text
                                    style={[
                                        globalStyles.buttonText,
                                        themeStyles.btnPrimaryText,
                                    ]}
                                >
                                    {salvando
                                        ? "Processando..."
                                        : "Gerar explicação"}
                                </Text>
                            </Pressable>

                            <Pressable
                                accessibilityRole="button"
                                accessibilityLabel="Limpar campos"
                                android_ripple={{ color: colors.ripple }}
                                style={[
                                    globalStyles.button,
                                    listStyles.rowButton,
                                    themeStyles.btnSecondary,
                                ]}
                                onPress={limpar}
                            >
                                <Text
                                    style={[
                                        globalStyles.buttonText,
                                        themeStyles.btnSecondaryText,
                                    ]}
                                >
                                    Limpar
                                </Text>
                            </Pressable>
                        </View>

                        {/* Mensagem + botão de preview */}
                        {!!htmlGerado && (
                            <View style={{ marginTop: 16 }}>
                                <Text
                                    style={[
                                        globalStyles.text,
                                        {
                                            color: colors.mutedText,
                                            marginBottom: 8,
                                            textAlign: "center",
                                        },
                                    ]}
                                >
                                    Explicação gerada com sucesso! Toque no botão
                                    abaixo para visualizar/imprimir em tela cheia.
                                </Text>

                                <Pressable
                                    accessibilityRole="button"
                                    accessibilityLabel="Abrir explicação em tela cheia"
                                    android_ripple={{ color: colors.ripple }}
                                    onPress={abrirPreview}
                                    style={[
                                        globalStyles.button,
                                        themeStyles.btnPrimary,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            globalStyles.buttonText,
                                            themeStyles.btnPrimaryText,
                                        ]}
                                    >
                                        Ver explicação em tela cheia
                                    </Text>
                                </Pressable>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
