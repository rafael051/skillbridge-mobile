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
import { useTheme } from "../../src/context/ThemeContext";
import globalStyles, { formStyles, listStyles } from "../../src/styles/globalStyles";
import ThemeToggleButton from "../../src/components/ThemeToggleButton";

/* ============================================================================
   Utils simples
   ============================================================================ */
const sanitize = (t: string) => (t ?? "").replace(/[“”"']/g, "").trim();
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
        <View
            style={[
                listStyles.rowItem,
                { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
        >
            <View style={{ flex: 1 }}>
                <Text
                    style={[
                        globalStyles.cardPlaca,
                        { color: colors.text, marginBottom: 4 },
                    ]}
                >
                    #{item.id} • {item.titulo}
                </Text>
                <Text style={[globalStyles.text, { color: colors.mutedText }]}>
                    Empresa: {item.empresa}
                </Text>
                {!!item.score && (
                    <Text style={[globalStyles.text, { color: colors.mutedText }]}>
                        Score: {(item.score * 100).toFixed(1)}%
                    </Text>
                )}
                <Text
                    style={[globalStyles.text, { color: colors.mutedText }]}
                    numberOfLines={2}
                >
                    Requisitos: {item.requisitos}
                </Text>
            </View>

            {/* Ações por vaga (mock) */}
            <View style={{ gap: 8 }}>
                <Pressable
                    android_ripple={{ color: colors.ripple }}
                    onPress={() =>
                        Alert.alert(
                            "Detalhes da vaga",
                            `Vaga #${item.id}: ${item.titulo}\nEmpresa: ${item.empresa}\n\nRequisitos:\n${item.requisitos}`
                        )
                    }
                    style={[
                        listStyles.smallBtn,
                        {
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                        },
                    ]}
                >
                    <Text style={{ color: colors.text }}>Ver detalhes</Text>
                </Pressable>

                <Pressable
                    android_ripple={{ color: colors.ripple }}
                    onPress={() =>
                        Alert.alert(
                            "Simulação",
                            `Aqui poderíamos abrir um fluxo de candidatura para a vaga #${item.id}.`
                        )
                    }
                    style={[
                        listStyles.smallBtnDanger,
                        {
                            backgroundColor: colors.button,
                            borderColor: colors.button,
                        },
                    ]}
                >
                    <Text style={{ color: colors.buttonText }}>Candidatar</Text>
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
                        Informe o ID do cliente e a quantidade máxima de vagas
                        recomendadas (TopN). No backend, isso conversa com
                        {" "}
                        GET /api/v1/recomendacao/jobs/{"{clienteId}"}.
                    </Text>

                    {/* Card de filtros / parâmetros */}
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

                        {/* Cliente ID */}
                        <View style={globalStyles.inputContainer}>
                            <Text
                                style={[
                                    globalStyles.inputLabel,
                                    { color: colors.mutedText },
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
                                    {
                                        borderColor: fieldErrors.clienteId
                                            ? colors.dangerBorder
                                            : colors.border,
                                        color: colors.text,
                                        backgroundColor: colors.surface,
                                    },
                                ]}
                            />
                            {!!fieldErrors.clienteId && (
                                <Text
                                    style={[
                                        globalStyles.text,
                                        { color: colors.dangerBorder },
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
                                    { color: colors.mutedText },
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
                                    {
                                        borderColor: fieldErrors.topN
                                            ? colors.dangerBorder
                                            : colors.border,
                                        color: colors.text,
                                        backgroundColor: colors.surface,
                                    },
                                ]}
                            />
                            {!!fieldErrors.topN && (
                                <Text
                                    style={[
                                        globalStyles.text,
                                        { color: colors.dangerBorder },
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
                                    { backgroundColor: colors.button },
                                ]}
                                onPress={buscarRecomendacoes}
                            >
                                <Text
                                    style={[
                                        globalStyles.buttonText,
                                        { color: colors.buttonText },
                                    ]}
                                >
                                    {salvando
                                        ? "Buscando..."
                                        : "Buscar recomendações"}
                                </Text>
                            </Pressable>

                            <Pressable
                                accessibilityRole="button"
                                accessibilityLabel="Limpar filtros e lista"
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

                    {/* Lista de recomendações */}
                    <View
                        style={[
                            listStyles.cardOutlined,
                            {
                                backgroundColor: colors.surface,
                                borderColor: colors.border,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                globalStyles.text,
                                {
                                    color: colors.mutedText,
                                    marginBottom: 8,
                                    textAlign: "left",
                                },
                            ]}
                        >
                            Resultados de recomendação:
                        </Text>

                        <FlatList
                            data={recomendacoes}
                            keyExtractor={keyExtractor}
                            ItemSeparatorComponent={() => (
                                <View style={{ height: 10 }} />
                            )}
                            ListEmptyComponent={
                                <Text
                                    style={[
                                        globalStyles.text,
                                        {
                                            color: colors.mutedText,
                                            textAlign: "center",
                                        },
                                    ]}
                                >
                                    Nenhuma recomendação carregada. Informe o
                                    cliente e clique em "Buscar recomendações".
                                </Text>
                            }
                            renderItem={renderItem}
                        />
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
