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
import { useTheme } from "../../src/context/ThemeContext";
import globalStyles, { formStyles, listStyles } from "../../src/styles/globalStyles";
import ThemeToggleButton from "../../src/components/ThemeToggleButton";

/* ============================================================================
   Utils simples
   ============================================================================ */
const sanitize = (t: string) => (t ?? "").replace(/[“”"']/g, "").trim();
const extractDigits = (t?: string) => (t ?? "").replace(/\D/g, "");

const isValidEmail = (email?: string) => {
    if (!email) return false;
    const e = email.trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
};

/* ============================================================================
   CurriculoScreen – formulário para montar dados do currículo
   (sem i18n / sem API por enquanto)
   ============================================================================ */
export default function CurriculoScreen() {
    const { colors } = useTheme();

    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

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
       "Gerar" currículo (validação + Alert; no futuro chama API)
       ============================================================================ */
    const gerarCurriculo = async () => {
        setFieldErrors({});
        setErro(null);

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
            newErrors.resumo = "Faça um breve resumo sobre você (mínimo 10 caracteres).";
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
            const payload = {
                nome,
                email,
                telefone: telefoneDigits,
                cargoDesejado: cargo,
                resumo,
                experiencias,
                formacao,
                habilidades,
            };

            console.log("Currículo (payload simulado):", payload);

            // 👉 FUTURO: aqui você chama a API /gen/curriculo ou algo assim
            Alert.alert(
                "Currículo gerado",
                "Simulação: os dados do currículo foram estruturados. No próximo passo vamos integrar com a API."
            );
        } catch (e: any) {
            const msg = e?.message ?? "Falha ao gerar currículo.";
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
                        Preencha os dados abaixo para montar seu currículo.
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
                                accessibilityHint="Valida os dados e monta o currículo para envio à API."
                                android_ripple={{ color: colors.ripple }}
                                disabled={salvando}
                                style={[
                                    globalStyles.button,
                                    { backgroundColor: colors.button },
                                ]}
                                onPress={gerarCurriculo}
                            >
                                <Text
                                    style={[
                                        globalStyles.buttonText,
                                        { color: colors.buttonText },
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
