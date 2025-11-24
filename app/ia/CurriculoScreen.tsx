// File: app/CurriculoScreen.tsx
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
    type CvHtmlRequest,
    type CvHtmlResponse,
} from "../../src/services/skillbridgeAiApi";

/* ============================================================================
 * Utils simples
 * ========================================================================== */
const sanitize = (t?: string) => (t ?? "").replace(/[“”"']/g, "").trim();
const extractDigits = (t?: string) => (t ?? "").replace(/\D/g, "");

const isValidEmail = (email?: string) => {
    if (!email) return false;
    const e = email.trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
};

/* ============================================================================
 * CurriculoScreen
 * ========================================================================== */
export default function CurriculoScreen() {
    const { colors } = useTheme();
    const themeStyles = themedStyles(colors);

    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [htmlGerado, setHtmlGerado] = useState<string | null>(null);

    const [fieldErrors, setFieldErrors] = useState<{
        nome?: string;
        email?: string;
        telefone?: string;
        cargo?: string;
        resumo?: string;
    }>({});

    const [form, setForm] = useState<{
        nome: string;
        email: string;
        telefone: string;
        cargoDesejado: string;
        resumo: string;
        experiencias: string;
        formacao: string;
        habilidades: string;
    }>({
        nome: "",
        email: "",
        telefone: "",
        cargoDesejado: "",
        resumo: "",
        experiencias: "",
        formacao: "",
        habilidades: "",
    });

    const tituloPagina = "📄 Montar Currículo";

    /* ============================================================================
     * Gerar currículo chamando a API /gen/cv/html
     * ========================================================================== */
    const gerarCurriculo = async () => {
        setFieldErrors({});
        setErro(null);
        setHtmlGerado(null);

        const nome = sanitize(form.nome);
        const email = sanitize(form.email);
        const telefoneDigits = extractDigits(form.telefone);
        const cargo = sanitize(form.cargoDesejado);
        const resumo = sanitize(form.resumo);
        const experiencias = sanitize(form.experiencias);
        const formacao = sanitize(form.formacao);
        const habilidades = sanitize(form.habilidades);

        const newErrors: typeof fieldErrors = {};
        let hasError = false;

        if (!nome || nome.length < 3) {
            newErrors.nome = "Nome deve ter ao menos 3 caracteres.";
            hasError = true;
        }

        if (!email || !isValidEmail(email)) {
            newErrors.email = "Informe um e-mail válido.";
            hasError = true;
        }

        if (!telefoneDigits || telefoneDigits.length < 10) {
            newErrors.telefone = "Informe um telefone válido (com DDD).";
            hasError = true;
        }

        if (!cargo || cargo.length < 3) {
            newErrors.cargo = "Informe o cargo ou área desejada.";
            hasError = true;
        }

        if (!resumo || resumo.length < 10) {
            newErrors.resumo =
                "Faça um breve resumo sobre você (mínimo 10 caracteres).";
            hasError = true;
        }

        if (hasError) {
            setFieldErrors(newErrors);
            const firstErrorMsg =
                newErrors.nome ||
                newErrors.email ||
                newErrors.telefone ||
                newErrors.cargo ||
                newErrors.resumo ||
                "Revise os campos destacados.";
            Alert.alert("Validação", firstErrorMsg);
            return;
        }

        setSalvando(true);
        try {
            const payload: CvHtmlRequest = {
                idioma: "pt-BR",
                dados: {
                    nome,
                    email,
                    telefone: telefoneDigits,
                    cargoDesejado: cargo,
                    resumo,
                    experiencias,
                    formacao,
                    habilidades,
                },
            };

            console.log("📨 Enviando para /gen/cv/html:", payload);

            const resp: CvHtmlResponse =
                await SkillBridgeIA.gerarCurriculoHtml(payload);

            console.log("✅ Resposta /gen/cv/html (string HTML):", resp);

            const html = resp || "";
            setHtmlGerado(html);

            Alert.alert(
                "Currículo gerado",
                "O currículo foi gerado. Toque em 'Ver currículo em tela cheia' para visualizar."
            );
        } catch (e: any) {
            const msg =
                e?.response?.data?.detail ||
                e?.message ||
                "Falha ao gerar currículo na API.";
            console.log("❌ Erro ao chamar /gen/cv/html:", e);
            setErro(msg);
            Alert.alert("Erro", msg);
        } finally {
            setSalvando(false);
        }
    };

    const limpar = () => {
        setForm({
            nome: "",
            email: "",
            telefone: "",
            cargoDesejado: "",
            resumo: "",
            experiencias: "",
            formacao: "",
            habilidades: "",
        });
        setFieldErrors({});
        setErro(null);
        setHtmlGerado(null);
    };

    /* ============================================================================
     * Abrir preview em tela cheia (WebView em /cv-preview)
     *  👉 Certifique-se de ter o arquivo app/cv-preview.tsx ou app/cv-preview/index.tsx
     * ========================================================================== */
    const abrirPreview = () => {
        if (!htmlGerado) {
            Alert.alert(
                "Prévia indisponível",
                "Gere o currículo antes de abrir a visualização."
            );
            return;
        }

        router.push({
            pathname: "ia/cv-preview",
            params: { html: htmlGerado },
        });
    };

    /* ============================================================================
     * Render
     * ========================================================================== */
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
                    {/* Header: Voltar + título + tema */}
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
                            Preencha os dados abaixo para montar seu currículo
                            com ajuda da IA.
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
                                    {
                                        color: colors.dangerBorder,
                                        marginBottom: 8,
                                    },
                                ]}
                            >
                                {erro}
                            </Text>
                        )}

                        {/* Nome completo */}
                        <View style={globalStyles.inputContainer}>
                            <Text
                                style={[
                                    globalStyles.inputLabel,
                                    { color: colors.mutedText },
                                ]}
                            >
                                Nome completo
                            </Text>
                            <TextInput
                                placeholder="Ex.: Rafael Rodrigues de Almeida"
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

                        {/* E-mail */}
                        <View style={globalStyles.inputContainer}>
                            <Text
                                style={[
                                    globalStyles.inputLabel,
                                    { color: colors.mutedText },
                                ]}
                            >
                                E-mail
                            </Text>
                            <TextInput
                                placeholder="Ex.: rafael@email.com"
                                placeholderTextColor={colors.mutedText}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={form.email}
                                onChangeText={(v) =>
                                    setForm((s) => ({ ...s, email: v }))
                                }
                                editable={!salvando}
                                style={[
                                    globalStyles.input,
                                    {
                                        borderColor: fieldErrors.email
                                            ? colors.dangerBorder
                                            : colors.border,
                                        color: colors.text,
                                        backgroundColor: colors.surface,
                                    },
                                ]}
                            />
                            {!!fieldErrors.email && (
                                <Text
                                    style={[
                                        globalStyles.text,
                                        { color: colors.dangerBorder },
                                    ]}
                                >
                                    {fieldErrors.email}
                                </Text>
                            )}
                        </View>

                        {/* Telefone */}
                        <View style={globalStyles.inputContainer}>
                            <Text
                                style={[
                                    globalStyles.inputLabel,
                                    { color: colors.mutedText },
                                ]}
                            >
                                Telefone
                            </Text>
                            <TextInput
                                placeholder="Ex.: (11) 99999-0000"
                                placeholderTextColor={colors.mutedText}
                                keyboardType="phone-pad"
                                value={form.telefone}
                                onChangeText={(v) =>
                                    setForm((s) => ({ ...s, telefone: v }))
                                }
                                editable={!salvando}
                                style={[
                                    globalStyles.input,
                                    {
                                        borderColor: fieldErrors.telefone
                                            ? colors.dangerBorder
                                            : colors.border,
                                        color: colors.text,
                                        backgroundColor: colors.surface,
                                    },
                                ]}
                            />
                            {!!fieldErrors.telefone && (
                                <Text
                                    style={[
                                        globalStyles.text,
                                        { color: colors.dangerBorder },
                                    ]}
                                >
                                    {fieldErrors.telefone}
                                </Text>
                            )}
                        </View>

                        {/* Cargo desejado */}
                        <View style={globalStyles.inputContainer}>
                            <Text
                                style={[
                                    globalStyles.inputLabel,
                                    { color: colors.mutedText },
                                ]}
                            >
                                Cargo / área desejada
                            </Text>
                            <TextInput
                                placeholder="Ex.: Desenvolvedor Backend Júnior"
                                placeholderTextColor={colors.mutedText}
                                value={form.cargoDesejado}
                                onChangeText={(v) =>
                                    setForm((s) => ({ ...s, cargoDesejado: v }))
                                }
                                editable={!salvando}
                                style={[
                                    globalStyles.input,
                                    {
                                        borderColor: fieldErrors.cargo
                                            ? colors.dangerBorder
                                            : colors.border,
                                        color: colors.text,
                                        backgroundColor: colors.surface,
                                    },
                                ]}
                            />
                            {!!fieldErrors.cargo && (
                                <Text
                                    style={[
                                        globalStyles.text,
                                        { color: colors.dangerBorder },
                                    ]}
                                >
                                    {fieldErrors.cargo}
                                </Text>
                            )}
                        </View>

                        {/* Resumo / Sobre */}
                        <View style={globalStyles.inputContainer}>
                            <Text
                                style={[
                                    globalStyles.inputLabel,
                                    { color: colors.mutedText },
                                ]}
                            >
                                Resumo / sobre você
                            </Text>
                            <TextInput
                                placeholder="Fale brevemente sobre seu perfil, pontos fortes e objetivos."
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

                        {/* Experiências */}
                        <View style={globalStyles.inputContainer}>
                            <Text
                                style={[
                                    globalStyles.inputLabel,
                                    { color: colors.mutedText },
                                ]}
                            >
                                Experiências (profissionais ou projetos)
                            </Text>
                            <TextInput
                                placeholder="Liste experiências relevantes (empresa, cargo, período, atividades) ou projetos pessoais."
                                placeholderTextColor={colors.mutedText}
                                value={form.experiencias}
                                onChangeText={(v) =>
                                    setForm((s) => ({ ...s, experiencias: v }))
                                }
                                editable={!salvando}
                                multiline
                                numberOfLines={4}
                                style={[
                                    globalStyles.input,
                                    {
                                        color: colors.text,
                                        backgroundColor: colors.surface,
                                        height: 120,
                                        textAlignVertical: "top",
                                    },
                                ]}
                            />
                        </View>

                        {/* Formação acadêmica */}
                        <View style={globalStyles.inputContainer}>
                            <Text
                                style={[
                                    globalStyles.inputLabel,
                                    { color: colors.mutedText },
                                ]}
                            >
                                Formação acadêmica
                            </Text>
                            <TextInput
                                placeholder="Ex.: Tecnólogo em Análise e Desenvolvimento de Sistemas – FIAP – 2º ano."
                                placeholderTextColor={colors.mutedText}
                                value={form.formacao}
                                onChangeText={(v) =>
                                    setForm((s) => ({ ...s, formacao: v }))
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

                        {/* Habilidades */}
                        <View style={globalStyles.inputContainer}>
                            <Text
                                style={[
                                    globalStyles.inputLabel,
                                    { color: colors.mutedText },
                                ]}
                            >
                                Habilidades / tecnologias
                            </Text>
                            <TextInput
                                placeholder="Ex.: Java, Spring, React, SQL, Git, Comunicação, Trabalho em equipe..."
                                placeholderTextColor={colors.mutedText}
                                value={form.habilidades}
                                onChangeText={(v) =>
                                    setForm((s) => ({ ...s, habilidades: v }))
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
                                accessibilityLabel="Gerar currículo"
                                accessibilityHint="Valida os dados e envia para a API de IA para gerar o currículo em HTML."
                                android_ripple={{ color: colors.ripple }}
                                disabled={salvando}
                                style={[
                                    globalStyles.button,
                                    listStyles.rowButton,
                                    themeStyles.btnPrimary,
                                ]}
                                onPress={gerarCurriculo}
                            >
                                <Text
                                    style={[
                                        globalStyles.buttonText,
                                        themeStyles.btnPrimaryText,
                                    ]}
                                >
                                    {salvando ? "Processando..." : "Gerar currículo"}
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
                                    Currículo gerado com sucesso! Toque no botão
                                    abaixo para visualizar em tela cheia.
                                </Text>

                                <Pressable
                                    accessibilityRole="button"
                                    accessibilityLabel="Abrir currículo em tela cheia"
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
                                        Ver currículo em tela cheia
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
