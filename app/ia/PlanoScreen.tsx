// File: app/ia/PlanoScreen.tsx
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
    type PlanRequest,
    type PlanHtmlResponse, // <-- NOVO tipo (string) vindo da API
} from "../../src/services/skillbridgeAiApi";

/* ============================================================================
// Utils simples
============================================================================ */
const sanitize = (t?: string) => (t ?? "").replace(/[“”"']/g, "").trim();
const extractDigits = (t?: string) => (t ?? "").replace(/\D/g, "");

const splitList = (txt: string): string[] =>
    txt
        .split(/[;,]/)
        .map((s) => sanitize(s))
        .filter((s) => s.length > 0);

/* ============================================================================
// PlanoScreen – formulário para montar um plano de carreira / requalificação
// (integrado com a API /gen/plan)
============================================================================ */
export default function PlanoScreen() {
    const { colors } = useTheme();
    const themeStyles = themedStyles(colors);

    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    const [fieldErrors, setFieldErrors] = useState<{
        nome?: string;
        idade?: string;
        pontoPartida?: string;
        objetivo?: string;
        areaInteresse?: string;
        tempoDisponivel?: string;
        nivelAtual?: string;
    }>({});

    const [form, setForm] = useState<{
        idioma: string;
        nome: string;
        idade: string;
        pontoPartida: string;
        objetivo: string;
        areaInteresse: string;
        tempoDisponivel: string;
        nivelAtual: string;
        modoEstudo: string;
        observacoes: string;
    }>({
        idioma: "pt-BR",
        nome: "",
        idade: "",
        pontoPartida: "",
        objetivo: "",
        areaInteresse: "",
        tempoDisponivel: "",
        nivelAtual: "",
        modoEstudo: "",
        observacoes: "",
    });

    // HTML do plano retornado pela API (para abrir no preview)
    const [htmlPlanoGerado, setHtmlPlanoGerado] = useState<string | null>(null);

    const tituloPagina = "📌 Plano de Carreira / Requalificação";

    /* ========================================================================
       Gerar plano (validação + chamada API /gen/plan via SkillBridgeIA.gerarPlano)
       ===================================================================== */
    const gerarPlano = async () => {
        setFieldErrors({});
        setErro(null);
        setHtmlPlanoGerado(null);

        const idioma = sanitize(form.idioma) || "pt-BR";
        const nome = sanitize(form.nome);
        const idadeStr = sanitize(form.idade);
        const pontoPartida = sanitize(form.pontoPartida);
        const objetivo = sanitize(form.objetivo);
        const areaInteresse = sanitize(form.areaInteresse);
        const tempoDisponivel = sanitize(form.tempoDisponivel);
        const nivelAtual = sanitize(form.nivelAtual);
        const modoEstudo = sanitize(form.modoEstudo);
        const observacoes = sanitize(form.observacoes);

        const newErrors: typeof fieldErrors = {};
        let hasError = false;

        const idadeNum = idadeStr ? Number(idadeStr.replace(/\D/g, "")) : NaN;

        if (!nome || nome.length < 3) {
            newErrors.nome = "Nome deve ter ao menos 3 caracteres.";
            hasError = true;
        }

        if (!idadeStr || isNaN(idadeNum) || idadeNum <= 0) {
            newErrors.idade = "Informe uma idade válida.";
            hasError = true;
        }

        if (!pontoPartida || pontoPartida.length < 5) {
            newErrors.pontoPartida =
                "Descreva brevemente o ponto de partida (experiência atual).";
            hasError = true;
        }

        if (!objetivo || objetivo.length < 5) {
            newErrors.objetivo =
                "Descreva o objetivo principal do plano (mínimo 5 caracteres).";
            hasError = true;
        }

        if (!areaInteresse || areaInteresse.length < 3) {
            newErrors.areaInteresse =
                "Informe a área de interesse (ex.: backend, dados, nuvem...).";
            hasError = true;
        }

        if (!tempoDisponivel || tempoDisponivel.length < 3) {
            newErrors.tempoDisponivel =
                "Informe o tempo disponível de estudo por semana.";
            hasError = true;
        }

        if (!nivelAtual) {
            newErrors.nivelAtual =
                'Informe o nível atual (ex.: "iniciante", "intermediário", "avançado").';
            hasError = true;
        }

        if (hasError) {
            setFieldErrors(newErrors);
            const firstErrorMsg =
                newErrors.nome ||
                newErrors.idade ||
                newErrors.pontoPartida ||
                newErrors.objetivo ||
                newErrors.areaInteresse ||
                newErrors.tempoDisponivel ||
                newErrors.nivelAtual ||
                "Revise os campos destacados.";
            Alert.alert("Validação", firstErrorMsg);
            return;
        }

        // ----------------- Monta o PlanRequest alinhado com skillbridgeIaApi.ts -----------------
        const disponibilidadeHorasStr = extractDigits(tempoDisponivel);
        const disponibilidadeHoras = disponibilidadeHorasStr
            ? Number(disponibilidadeHorasStr)
            : undefined;

        // Transformar alguns campos em listas simples para softSkills/hardSkills
        const softSkills = splitList(pontoPartida); // coisas que a pessoa já faz / perfil
        const hardSkills = splitList(areaInteresse); // áreas tecnológicas de interesse

        const objetivoPerfil = [
            `Nome: ${nome} (${idadeNum} anos)`,
            `Ponto de partida: ${pontoPartida}`,
            `Objetivo: ${objetivo}`,
            `Área de interesse: ${areaInteresse}`,
            `Nível atual: ${nivelAtual}`,
            modoEstudo ? `Modo de estudo preferido: ${modoEstudo}` : "",
            observacoes ? `Observações: ${observacoes}` : "",
        ]
            .filter(Boolean)
            .join(" | ");

        const payload: PlanRequest = {
            idioma,
            perfil: {
                softSkills,
                hardSkills,
                objetivo: objetivoPerfil,
                disponibilidadeSemanalHoras: disponibilidadeHoras,
            },
        };

        setSalvando(true);
        try {
            console.log("📨 Enviando para /gen/plan:", payload);

            // 👉 API devolve HTML pronto
            const html: PlanHtmlResponse = await SkillBridgeIA.gerarPlano(payload);

            console.log("✅ HTML /gen/plan recebido, tamanho:", html?.length);

            setHtmlPlanoGerado(html);

            // 👉 Redireciona automaticamente para o preview
            router.push({
                pathname: "/ia/plan-preview",
                params: { html },
            });

            Alert.alert(
                "Plano gerado",
                "Plano de carreira gerado e aberto em tela cheia."
            );
        } catch (e: any) {
            const msg =
                e?.response?.data?.detail ||
                e?.message ||
                "Falha ao gerar o plano na API.";
            console.log("❌ Erro ao chamar /gen/plan:", e);
            setErro(msg);
            Alert.alert("Erro", msg);
        } finally {
            setSalvando(false);
        }
    };

    const limpar = () => {
        setForm({
            idioma: "pt-BR",
            nome: "",
            idade: "",
            pontoPartida: "",
            objetivo: "",
            areaInteresse: "",
            tempoDisponivel: "",
            nivelAtual: "",
            modoEstudo: "",
            observacoes: "",
        });
        setFieldErrors({});
        setErro(null);
        setHtmlPlanoGerado(null);
    };

    /* ========================================================================
       Abrir preview em tela cheia (WebView em /ia/plan-preview)
       ===================================================================== */
    const abrirPreview = () => {
        if (!htmlPlanoGerado) {
            Alert.alert(
                "Prévia indisponível",
                "Gere o plano antes de abrir a visualização."
            );
            return;
        }

        router.push({
            pathname: "/ia/plan-preview",
            params: { html: htmlPlanoGerado },
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

                        {/* Título */}
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
                            Preencha os dados abaixo para montar um plano de carreira /
                            requalificação personalizado.
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
                                placeholder='Ex.: "pt-BR"'
                                placeholderTextColor={colors.mutedText}
                                value={form.idioma}
                                onChangeText={(v) =>
                                    setForm((s) => ({ ...s, idioma: v }))
                                }
                                editable={!salvando}
                                style={[
                                    globalStyles.input,
                                    {
                                        color: colors.text,
                                        backgroundColor: colors.surface,
                                    },
                                ]}
                            />
                        </View>

                        {/* Nome */}
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

                        {/* Idade */}
                        <View style={globalStyles.inputContainer}>
                            <Text
                                style={[
                                    globalStyles.inputLabel,
                                    { color: colors.mutedText },
                                ]}
                            >
                                Idade
                            </Text>
                            <TextInput
                                placeholder="Ex.: 28"
                                placeholderTextColor={colors.mutedText}
                                value={form.idade}
                                keyboardType="numeric"
                                onChangeText={(v) =>
                                    setForm((s) => ({ ...s, idade: v }))
                                }
                                editable={!salvando}
                                style={[
                                    globalStyles.input,
                                    {
                                        borderColor: fieldErrors.idade
                                            ? colors.dangerBorder
                                            : colors.border,
                                        color: colors.text,
                                        backgroundColor: colors.surface,
                                    },
                                ]}
                            />
                            {!!fieldErrors.idade && (
                                <Text
                                    style={[
                                        globalStyles.text,
                                        { color: colors.dangerBorder },
                                    ]}
                                >
                                    {fieldErrors.idade}
                                </Text>
                            )}
                        </View>

                        {/* Ponto de partida */}
                        <View style={globalStyles.inputContainer}>
                            <Text
                                style={[
                                    globalStyles.inputLabel,
                                    { color: colors.mutedText },
                                ]}
                            >
                                Ponto de partida (experiência atual)
                            </Text>
                            <TextInput
                                placeholder="Ex.: Atua hoje com suporte técnico, conhece um pouco de redes e hardware..."
                                placeholderTextColor={colors.mutedText}
                                value={form.pontoPartida}
                                onChangeText={(v) =>
                                    setForm((s) => ({ ...s, pontoPartida: v }))
                                }
                                editable={!salvando}
                                multiline
                                numberOfLines={3}
                                style={[
                                    globalStyles.input,
                                    {
                                        borderColor: fieldErrors.pontoPartida
                                            ? colors.dangerBorder
                                            : colors.border,
                                        color: colors.text,
                                        backgroundColor: colors.surface,
                                        height: 90,
                                        textAlignVertical: "top",
                                    },
                                ]}
                            />
                            {!!fieldErrors.pontoPartida && (
                                <Text
                                    style={[
                                        globalStyles.text,
                                        { color: colors.dangerBorder },
                                    ]}
                                >
                                    {fieldErrors.pontoPartida}
                                </Text>
                            )}
                        </View>

                        {/* Objetivo principal */}
                        <View style={globalStyles.inputContainer}>
                            <Text
                                style={[
                                    globalStyles.inputLabel,
                                    { color: colors.mutedText },
                                ]}
                            >
                                Objetivo principal
                            </Text>
                            <TextInput
                                placeholder="Ex.: Migrar para desenvolvimento backend em até 12 meses."
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
                                        height: 90,
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

                        {/* Área de interesse */}
                        <View style={globalStyles.inputContainer}>
                            <Text
                                style={[
                                    globalStyles.inputLabel,
                                    { color: colors.mutedText },
                                ]}
                            >
                                Área de interesse
                            </Text>
                            <TextInput
                                placeholder="Ex.: Desenvolvimento backend, dados, nuvem, mobile... (separe por vírgula)"
                                placeholderTextColor={colors.mutedText}
                                value={form.areaInteresse}
                                onChangeText={(v) =>
                                    setForm((s) => ({ ...s, areaInteresse: v }))
                                }
                                editable={!salvando}
                                style={[
                                    globalStyles.input,
                                    {
                                        borderColor: fieldErrors.areaInteresse
                                            ? colors.dangerBorder
                                            : colors.border,
                                        color: colors.text,
                                        backgroundColor: colors.surface,
                                    },
                                ]}
                            />
                            {!!fieldErrors.areaInteresse && (
                                <Text
                                    style={[
                                        globalStyles.text,
                                        { color: colors.dangerBorder },
                                    ]}
                                >
                                    {fieldErrors.areaInteresse}
                                </Text>
                            )}
                        </View>

                        {/* Tempo disponível */}
                        <View style={globalStyles.inputContainer}>
                            <Text
                                style={[
                                    globalStyles.inputLabel,
                                    { color: colors.mutedText },
                                ]}
                            >
                                Tempo disponível por semana
                            </Text>
                            <TextInput
                                placeholder="Ex.: 10 horas por semana, estudar 2h por dia útil..."
                                placeholderTextColor={colors.mutedText}
                                value={form.tempoDisponivel}
                                onChangeText={(v) =>
                                    setForm((s) => ({ ...s, tempoDisponivel: v }))
                                }
                                editable={!salvando}
                                style={[
                                    globalStyles.input,
                                    {
                                        borderColor: fieldErrors.tempoDisponivel
                                            ? colors.dangerBorder
                                            : colors.border,
                                        color: colors.text,
                                        backgroundColor: colors.surface,
                                    },
                                ]}
                            />
                            {!!fieldErrors.tempoDisponivel && (
                                <Text
                                    style={[
                                        globalStyles.text,
                                        { color: colors.dangerBorder },
                                    ]}
                                >
                                    {fieldErrors.tempoDisponivel}
                                </Text>
                            )}
                        </View>

                        {/* Nível atual */}
                        <View style={globalStyles.inputContainer}>
                            <Text
                                style={[
                                    globalStyles.inputLabel,
                                    { color: colors.mutedText },
                                ]}
                            >
                                Nível atual
                            </Text>
                            <TextInput
                                placeholder='Ex.: "iniciante", "intermediário", "avançado".'
                                placeholderTextColor={colors.mutedText}
                                value={form.nivelAtual}
                                onChangeText={(v) =>
                                    setForm((s) => ({ ...s, nivelAtual: v }))
                                }
                                editable={!salvando}
                                style={[
                                    globalStyles.input,
                                    {
                                        borderColor: fieldErrors.nivelAtual
                                            ? colors.dangerBorder
                                            : colors.border,
                                        color: colors.text,
                                        backgroundColor: colors.surface,
                                    },
                                ]}
                            />
                            {!!fieldErrors.nivelAtual && (
                                <Text
                                    style={[
                                        globalStyles.text,
                                        { color: colors.dangerBorder },
                                    ]}
                                >
                                    {fieldErrors.nivelAtual}
                                </Text>
                            )}
                        </View>

                        {/* Modo de estudo */}
                        <View style={globalStyles.inputContainer}>
                            <Text
                                style={[
                                    globalStyles.inputLabel,
                                    { color: colors.mutedText },
                                ]}
                            >
                                Modo de estudo (opcional)
                            </Text>
                            <TextInput
                                placeholder="Ex.: Online, presencial, misto, cursos gravados, ao vivo..."
                                placeholderTextColor={colors.mutedText}
                                value={form.modoEstudo}
                                onChangeText={(v) =>
                                    setForm((s) => ({ ...s, modoEstudo: v }))
                                }
                                editable={!salvando}
                                style={[
                                    globalStyles.input,
                                    {
                                        color: colors.text,
                                        backgroundColor: colors.surface,
                                    },
                                ]}
                            />
                        </View>

                        {/* Observações adicionais */}
                        <View style={globalStyles.inputContainer}>
                            <Text
                                style={[
                                    globalStyles.inputLabel,
                                    { color: colors.mutedText },
                                ]}
                            >
                                Observações adicionais (opcional)
                            </Text>
                            <TextInput
                                placeholder="Limitações, preferências, prazos importantes, certificações desejadas..."
                                placeholderTextColor={colors.mutedText}
                                value={form.observacoes}
                                onChangeText={(v) =>
                                    setForm((s) => ({ ...s, observacoes: v }))
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
                                accessibilityLabel="Gerar plano de carreira"
                                accessibilityHint="Valida os dados e envia para a API de plano."
                                android_ripple={{ color: colors.ripple }}
                                disabled={salvando}
                                style={[
                                    globalStyles.button,
                                    listStyles.rowButton,
                                    themeStyles.btnPrimary,
                                ]}
                                onPress={gerarPlano}
                            >
                                <Text
                                    style={[
                                        globalStyles.buttonText,
                                        themeStyles.btnPrimaryText,
                                    ]}
                                >
                                    {salvando ? "Processando..." : "Gerar plano"}
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
                        {!!htmlPlanoGerado && (
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
                                    Plano gerado com sucesso! Toque no botão
                                    abaixo para visualizar em tela cheia.
                                </Text>

                                <Pressable
                                    accessibilityRole="button"
                                    accessibilityLabel="Abrir plano em tela cheia"
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
                                        Ver plano em tela cheia
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
