// File: app/PlanoScreen.tsx
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
   PlanoScreen – formulário para montar um plano de carreira / requalificação
   (sem i18n / sem API por enquanto)
   ============================================================================ */
export default function PlanoScreen() {
    const { colors } = useTheme();

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

    const tituloPagina = "📌 Plano de Carreira / Requalificação";

    /* ============================================================================
       "Gerar" plano (validação + Alert; no futuro chama API /gen/plan)
       ============================================================================ */
    const gerarPlano = async () => {
        setFieldErrors({});
        setErro(null);

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

        setSalvando(true);
        try {
            const payload = {
                idioma,
                perfil: {
                    nome,
                    idade: idadeNum,
                    pontoPartida,
                    areaInteresse,
                    nivelAtual,
                },
                objetivo,
                disponibilidade: {
                    tempoSemanal: tempoDisponivel,
                    modoEstudo: modoEstudo || undefined,
                },
                observacoes: observacoes || undefined,
            };

            console.log("Plano de carreira (payload simulado):", payload);

            // 👉 FUTURO: aqui você chama a API /gen/plan
            Alert.alert(
                "Plano estruturado",
                "Simulação: os dados do plano de carreira foram montados. No próximo passo vamos integrar com a API."
            );
        } catch (e: any) {
            const msg = e?.message ?? "Falha ao gerar o plano.";
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
                        Preencha os dados abaixo para montar um plano de carreira /
                        requalificação personalizado.
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
                                placeholder="Ex.: Desenvolvimento backend, dados, nuvem, mobile..."
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
                                accessibilityHint="Valida os dados e monta o payload para envio à API de plano."
                                android_ripple={{ color: colors.ripple }}
                                disabled={salvando}
                                style={[
                                    globalStyles.button,
                                    { backgroundColor: colors.button },
                                ]}
                                onPress={gerarPlano}
                            >
                                <Text
                                    style={[
                                        globalStyles.buttonText,
                                        { color: colors.buttonText },
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
