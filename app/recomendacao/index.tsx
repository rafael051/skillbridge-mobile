// File: app/recomendacao/index.tsx
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
    FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../../src/context/ThemeContext";
import globalStyles, {
    formStyles,
    listStyles,
    themedStyles,
} from "../../src/styles/globalStyles";
import ThemeToggleButton from "../../src/components/ThemeToggleButton";

/* ============================================================================
   Utils simples
   ============================================================================ */
const extractDigits = (t?: string) => (t ?? "").replace(/\D/g, "");

/* ============================================================================
   Tipo básico de recomendação de vaga
   (alinhado com JobResponseDTO + campo score opcional)
   ============================================================================ */
type JobRecommendation = {
    id: number;
    titulo: string;
    requisitos: string;
    empresa: string;
    score?: number;
};

/* ============================================================================
   Tela de Recomendações – app/recomendacao/index.tsx
   Usa clienteId + topN e exibe uma lista de vagas recomendadas (mock).
   ============================================================================ */
export default function RecomendacaoScreen() {
    const { colors } = useTheme();
    const themeStyles = themedStyles(colors);
    const router = useRouter();

    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    const [fieldErrors, setFieldErrors] = useState<{
        clienteId?: string;
        topN?: string;
    }>({});

    const [form, setForm] = useState<{
        clienteId: string;
        topN: string;
    }>({
        clienteId: "",
        topN: "5",
    });

    const [recomendacoes, setRecomendacoes] = useState<JobRecommendation[]>([]);

    const tituloPagina = "🎯 Recomendações de Vagas";

    /* ============================================================================
       Buscar recomendações (validação + MOCK; depois você liga na API real)
       ============================================================================ */
    const buscarRecomendacoes = async () => {
        setFieldErrors({});
        setErro(null);

        const clienteIdDigits = extractDigits(form.clienteId);
        const topNDigits = extractDigits(form.topN);

        const newErrors: typeof fieldErrors = {};
        let hasError = false;

        const clienteIdNum = clienteIdDigits ? Number(clienteIdDigits) : NaN;
        const topNNum = topNDigits ? Number(topNDigits) : 5;

        if (!clienteIdDigits || isNaN(clienteIdNum) || clienteIdNum <= 0) {
            newErrors.clienteId = "Informe um ID de cliente válido (inteiro > 0).";
            hasError = true;
        }

        if (topNDigits && (isNaN(topNNum) || topNNum <= 0)) {
            newErrors.topN = "Informe um valor válido para TopN (inteiro > 0).";
            hasError = true;
        }

        if (hasError) {
            setFieldErrors(newErrors);
            const firstErrorMsg =
                newErrors.clienteId ||
                newErrors.topN ||
                "Revise os campos destacados.";
            Alert.alert("Validação", firstErrorMsg);
            return;
        }

        setSalvando(true);
        try {
            const efetivoTopN = topNNum || 5;

            // URL simulada (para você visualizar o endpoint real)
            const urlSimulada = `/api/v1/recomendacao/jobs/${clienteIdNum}?topN=${efetivoTopN}`;
            console.log("Chamaria a API:", urlSimulada);

            // 👉 MOCK de recomendações (substituir depois pela resposta real da API)
            const mock: JobRecommendation[] = [
                {
                    id: 1,
                    titulo: "Desenvolvedor .NET Júnior",
                    empresa: "FIAP Tech",
                    requisitos: "C#, .NET, SQL, APIs REST",
                    score: 0.92,
                },
                {
                    id: 2,
                    titulo: "Desenvolvedor Fullstack (React + .NET)",
                    empresa: "SkillBridge Labs",
                    requisitos: "React, TypeScript, .NET, Clean Architecture",
                    score: 0.88,
                },
                {
                    id: 3,
                    titulo: "Analista de Suporte em Migração para Dev",
                    empresa: "FutureJobs",
                    requisitos: "Lógica, .NET básico, vontade de aprender",
                    score: 0.81,
                },
            ].slice(0, efetivoTopN);

            setRecomendacoes(mock);

            Alert.alert(
                "Recomendações simuladas",
                `Foram encontradas ${mock.length} vagas recomendadas para o cliente ${clienteIdNum}.`
            );
        } catch (e: any) {
            const msg = e?.message ?? "Falha ao buscar recomendações.";
            setErro(msg);
            Alert.alert("Erro", msg);
            setRecomendacoes([]);
        } finally {
            setSalvando(false);
        }
    };

    const limpar = () => {
        setForm({
            clienteId: "",
            topN: "5",
        });
        setFieldErrors({});
        setErro(null);
        setRecomendacoes([]);
    };

    /* ============================================================================
       Render item da lista
       ============================================================================ */
    const renderItem = ({ item }: { item: JobRecommendation }) => (
        <View style={[listStyles.rowItem, themeStyles.jobsCardContainer]}>
            <View style={listStyles.rowItemTextCol}>
                <Text
                    style={[
                        globalStyles.cardPlaca,
                        themeStyles.jobsCardTitleText,
                        globalStyles.textSmallMargin,
                    ]}
                >
                    #{item.id} • {item.titulo}
                </Text>

                <Text
                    style={[
                        globalStyles.text,
                        themeStyles.jobsCardTextStrong,
                        globalStyles.textSmallMargin,
                    ]}
                >
                    Empresa: {item.empresa}
                </Text>

                {!!item.score && (
                    <Text
                        style={[
                            globalStyles.text,
                            themeStyles.jobsCardTextMuted,
                            globalStyles.textSmallMargin,
                        ]}
                    >
                        Score: {(item.score * 100).toFixed(1)}%
                    </Text>
                )}

                <Text
                    style={[
                        globalStyles.text,
                        themeStyles.jobsCardTextMuted,
                    ]}
                    numberOfLines={2}
                >
                    Requisitos: {item.requisitos}
                </Text>
            </View>

            <View style={listStyles.rowActions}>
                <Pressable
                    android_ripple={{ color: colors.ripple }}
                    onPress={() =>
                        Alert.alert(
                            "Detalhes da vaga",
                            `Vaga #${item.id}: ${item.titulo}\nEmpresa: ${item.empresa}\n\nRequisitos:\n${item.requisitos}`
                        )
                    }
                    style={[listStyles.smallBtn, themeStyles.jobsCardEditBtn]}
                >
                    <Text
                        style={[
                            globalStyles.smallButtonText,
                            themeStyles.jobsCardEditText,
                        ]}
                    >
                        Ver detalhes
                    </Text>
                </Pressable>

                <Pressable
                    android_ripple={{ color: colors.ripple }}
                    onPress={() =>
                        Alert.alert(
                            "Simulação",
                            `Aqui poderíamos abrir um fluxo de candidatura para a vaga #${item.id}.`
                        )
                    }
                    style={[listStyles.smallBtn, themeStyles.jobsCardDeleteBtn]}
                >
                    <Text
                        style={[
                            globalStyles.smallButtonText,
                            themeStyles.jobsCardDeleteText,
                        ]}
                    >
                        Candidatar
                    </Text>
                </Pressable>
            </View>
        </View>
    );

    const keyExtractor = (item: JobRecommendation) => String(item.id);

    /* ============================================================================
       Render principal
       ============================================================================ */
    return (
        <SafeAreaView
            style={[
                globalStyles.container,
                globalStyles.screenTop,
                themeStyles.screenBackground,
            ]}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={globalStyles.screenFill}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={globalStyles.homeScrollContent}
                >
                    <View style={globalStyles.authContainer}>
                        {/* Botão Voltar */}
                        <View
                            style={[
                                listStyles.row,
                                { justifyContent: "flex-start" },
                            ]}
                        >
                            <Pressable
                                accessibilityRole="button"
                                accessibilityLabel="Voltar para a tela inicial"
                                android_ripple={{ color: colors.ripple }}
                                style={[
                                    globalStyles.button,
                                    listStyles.topButton,
                                    themeStyles.btnSecondary,
                                ]}
                                onPress={() => router.back()}
                            >
                                <Text
                                    style={[
                                        globalStyles.buttonText,
                                        themeStyles.btnSecondaryText,
                                    ]}
                                >
                                    Voltar
                                </Text>
                            </Pressable>
                        </View>

                        {/* Título */}
                        <Text
                            style={[
                                globalStyles.title,
                                themeStyles.titleText,
                                globalStyles.textSmallMargin,
                            ]}
                        >
                            {tituloPagina}
                        </Text>

                        <Text
                            style={[
                                globalStyles.text,
                                themeStyles.mutedText,
                                globalStyles.textCenter,
                            ]}
                        >
                            Informe o ID do cliente e a quantidade máxima de
                            vagas recomendadas (TopN). No backend, isso conversa
                            com GET&nbsp;/api/v1/recomendacao/jobs/
                            {"{clienteId}"}.
                        </Text>

                        {/* Card de filtros / parâmetros */}
                        <View
                            style={[
                                formStyles.card,
                                themeStyles.formCard,
                            ]}
                        >
                            {!!erro && (
                                <Text
                                    style={[
                                        globalStyles.text,
                                        themeStyles.errorText,
                                    ]}
                                >
                                    {erro}
                                </Text>
                            )}

                            {/* Cliente ID */}
                            <View style={globalStyles.inputContainer}>
                                <Text
                                    style={[
                                        globalStyles.inputLabel,
                                        themeStyles.mutedText,
                                    ]}
                                >
                                    ID do cliente
                                </Text>
                                <TextInput
                                    placeholder="Ex.: 1"
                                    placeholderTextColor={colors.mutedText}
                                    value={form.clienteId}
                                    keyboardType="numeric"
                                    onChangeText={(v) =>
                                        setForm((s) => ({ ...s, clienteId: v }))
                                    }
                                    editable={!salvando}
                                    style={[
                                        globalStyles.input,
                                        themeStyles.inputBase,
                                        fieldErrors.clienteId &&
                                        themeStyles.inputError,
                                    ]}
                                />
                                {!!fieldErrors.clienteId && (
                                    <Text
                                        style={[
                                            globalStyles.text,
                                            themeStyles.errorText,
                                        ]}
                                    >
                                        {fieldErrors.clienteId}
                                    </Text>
                                )}
                            </View>

                            {/* TopN */}
                            <View style={globalStyles.inputContainer}>
                                <Text
                                    style={[
                                        globalStyles.inputLabel,
                                        themeStyles.mutedText,
                                    ]}
                                >
                                    TopN (quantidade máxima de vagas)
                                </Text>
                                <TextInput
                                    placeholder="Ex.: 5"
                                    placeholderTextColor={colors.mutedText}
                                    value={form.topN}
                                    keyboardType="numeric"
                                    onChangeText={(v) =>
                                        setForm((s) => ({ ...s, topN: v }))
                                    }
                                    editable={!salvando}
                                    style={[
                                        globalStyles.input,
                                        themeStyles.inputBase,
                                        fieldErrors.topN &&
                                        themeStyles.inputError,
                                    ]}
                                />
                                {!!fieldErrors.topN && (
                                    <Text
                                        style={[
                                            globalStyles.text,
                                            themeStyles.errorText,
                                        ]}
                                    >
                                        {fieldErrors.topN}
                                    </Text>
                                )}
                            </View>

                            {/* Ações de filtro */}
                            <View style={listStyles.row}>
                                <Pressable
                                    accessibilityRole="button"
                                    accessibilityLabel="Buscar recomendações"
                                    accessibilityHint="Valida os dados e busca as vagas recomendadas (simulação)."
                                    android_ripple={{ color: colors.ripple }}
                                    disabled={salvando}
                                    style={[
                                        globalStyles.button,
                                        listStyles.topButton,
                                        themeStyles.btnPrimary,
                                    ]}
                                    onPress={buscarRecomendacoes}
                                >
                                    <Text
                                        style={[
                                            globalStyles.buttonText,
                                            themeStyles.btnPrimaryText,
                                        ]}
                                    >
                                        {salvando ? "Buscando..." : "Buscar"}
                                    </Text>
                                </Pressable>

                                <Pressable
                                    accessibilityRole="button"
                                    accessibilityLabel="Limpar filtros e lista"
                                    android_ripple={{ color: colors.ripple }}
                                    style={[
                                        globalStyles.button,
                                        listStyles.topButton,
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
                        </View>

                        {/* Lista de recomendações */}
                        <View
                            style={[
                                listStyles.cardOutlined,
                                themeStyles.jobsListCard,
                            ]}
                        >
                            <Text
                                style={[
                                    globalStyles.text,
                                    themeStyles.mutedText,
                                    listStyles.resultLabel,
                                ]}
                            >
                                Resultados de recomendação:
                            </Text>

                            <FlatList
                                data={recomendacoes}
                                keyExtractor={keyExtractor}
                                ItemSeparatorComponent={() => (
                                    <View style={listStyles.listSeparator} />
                                )}
                                ListEmptyComponent={
                                    <Text
                                        style={[
                                            globalStyles.text,
                                            themeStyles.mutedText,
                                            globalStyles.textCenter,
                                        ]}
                                    >
                                        Nenhuma recomendação carregada. Informe
                                        o cliente e clique em "Buscar".
                                    </Text>
                                }
                                contentContainerStyle={
                                    recomendacoes.length === 0
                                        ? listStyles.listContentEmpty
                                        : listStyles.listContent
                                }
                                renderItem={renderItem}
                            />
                        </View>

                        {/* Rodapé - Alternar tema */}
                        <View style={globalStyles.homeFooter}>
                            <ThemeToggleButton />
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
