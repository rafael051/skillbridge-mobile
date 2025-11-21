// File: app/clients/form.tsx
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    View,
    Text,
    TextInput,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "../../src/context/ThemeContext";
import globalStyles, { formStyles, listStyles } from "../../src/styles/globalStyles";
import ThemeToggleButton from "../../src/components/ThemeToggleButton";

/* ============================================================================
   🔤 Utils simples
   ============================================================================ */
const sanitize = (t: string) => (t ?? "").replace(/[“”"']/g, "").trim();

const isValidEmail = (email?: string) => {
    if (!email) return false;
    const e = email.trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
};

const extractDigits = (t?: string) => (t ?? "").replace(/\D/g, "");

/* ============================================================================
   📋 Form de Clientes (sem i18n / sem API)
   ============================================================================ */
export default function ClientForm() {
    const { id } = useLocalSearchParams<{ id?: string }>();
    const isEdit = !!id;
    const router = useRouter();
    const { colors } = useTheme();

    const [loading] = useState(false); // por enquanto não busca da API
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    const [fieldErrors, setFieldErrors] = useState<{
        nome?: string;
        email?: string;
        telefone?: string;
        skills?: string;
    }>({});

    const [form, setForm] = useState<{
        nome: string;
        email: string;
        telefone: string;
        skills: string;
        resumo: string;
    }>({
        nome: "",
        email: "",
        telefone: "",
        skills: "",
        resumo: "",
    });

    const titulo = isEdit ? "✏️ Editar Cliente" : "🧑‍💼 Novo Cliente";

    /* ============================================================================
       💾 Salvar (apenas validação + Alert, sem API ainda)
       ============================================================================ */
    const salvar = async () => {
        setFieldErrors({});
        setErro(null);

        const nome = sanitize(form.nome);
        const email = sanitize(form.email);
        const telefoneDigits = extractDigits(form.telefone);
        const skills = sanitize(form.skills);
        const resumo = sanitize(form.resumo);

        let hasError = false;
        const newErrors: typeof fieldErrors = {};

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

        if (skills && skills.length < 3) {
            newErrors.skills = "Descreva ao menos uma skill.";
            hasError = true;
        }

        if (hasError) {
            setFieldErrors(newErrors);
            const firstErrorMsg =
                newErrors.nome ||
                newErrors.email ||
                newErrors.telefone ||
                newErrors.skills ||
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
                skills,
                resumo,
            };

            // 👉 aqui no futuro entra a chamada real da API
            // por enquanto só simula
            const fakeId = isEdit ? Number(id) || 1 : Math.floor(Date.now() / 1000);

            Alert.alert(
                "Sucesso",
                isEdit
                    ? "Cliente atualizado (simulação, sem API ainda)."
                    : "Cliente criado (simulação, sem API ainda).",
                [
                    {
                        text: "OK",
                        onPress: () => {
                            if (!isEdit) {
                                router.replace(`/clients/form?id=${fakeId}`);
                            } else {
                                router.back();
                            }
                        },
                    },
                ]
            );
        } catch (e: any) {
            const msg = e?.message ?? "Falha ao salvar.";
            setErro(msg);
            Alert.alert("Erro", msg);
        } finally {
            setSalvando(false);
        }
    };

    /* ============================================================================
       🗑️ Excluir (simulação, sem API ainda)
       ============================================================================ */
    const excluir = async () => {
        if (!isEdit) return;

        const ok = await new Promise<boolean>((resolve) => {
            Alert.alert(
                "Confirmar exclusão?",
                "Essa ação não poderá ser desfeita.",
                [
                    { text: "Cancelar", style: "cancel", onPress: () => resolve(false) },
                    {
                        text: "Excluir",
                        style: "destructive",
                        onPress: () => resolve(true),
                    },
                ]
            );
        });

        if (!ok) return;

        try {
            // 👉 no futuro: chamada real de delete
            Alert.alert(
                "Excluído",
                "Cliente removido (simulação, sem API ainda)."
            );
            router.replace("/clients/list");
        } catch (e: any) {
            const msg = e?.message ?? "Não foi possível excluir o cliente.";
            Alert.alert("Erro", msg);
        }
    };

    /* ============================================================================
       🖼️ Render
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
                        {titulo}
                    </Text>
                    <Text
                        style={[
                            globalStyles.text,
                            { color: colors.mutedText, textAlign: "center" },
                        ]}
                    >
                        {isEdit
                            ? "Atualize os dados do cliente."
                            : "Preencha os dados para cadastrar um novo cliente."}
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
                        {loading ? (
                            <ActivityIndicator />
                        ) : (
                            <>
                                {!!erro && (
                                    <Text
                                        style={[
                                            globalStyles.text,
                                            { color: colors.dangerBorder },
                                        ]}
                                    >
                                        {erro}
                                    </Text>
                                )}

                                {/* Nome */}
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
                                        placeholder="Ex.: Ana Souza"
                                        placeholderTextColor={colors.mutedText}
                                        value={form.nome}
                                        onChangeText={(v) =>
                                            setForm((s) => ({ ...s, nome: v }))
                                        }
                                        editable={!salvando && !loading}
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
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        placeholder="Ex.: ana.souza@email.com"
                                        placeholderTextColor={colors.mutedText}
                                        value={form.email}
                                        onChangeText={(v) =>
                                            setForm((s) => ({ ...s, email: v }))
                                        }
                                        editable={!salvando && !loading}
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
                                        keyboardType="phone-pad"
                                        placeholder="Ex.: (11) 99999-0000"
                                        placeholderTextColor={colors.mutedText}
                                        value={form.telefone}
                                        onChangeText={(v) =>
                                            setForm((s) => ({
                                                ...s,
                                                telefone: v,
                                            }))
                                        }
                                        editable={!salvando && !loading}
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

                                {/* Skills */}
                                <View style={globalStyles.inputContainer}>
                                    <Text
                                        style={[
                                            globalStyles.inputLabel,
                                            { color: colors.mutedText },
                                        ]}
                                    >
                                        Skills principais
                                    </Text>
                                    <TextInput
                                        placeholder="Ex.: Java, React, SQL"
                                        placeholderTextColor={colors.mutedText}
                                        value={form.skills}
                                        onChangeText={(v) =>
                                            setForm((s) => ({ ...s, skills: v }))
                                        }
                                        editable={!salvando && !loading}
                                        style={[
                                            globalStyles.input,
                                            {
                                                borderColor: fieldErrors.skills
                                                    ? colors.dangerBorder
                                                    : colors.border,
                                                color: colors.text,
                                                backgroundColor: colors.surface,
                                            },
                                        ]}
                                        multiline
                                    />
                                    {!!fieldErrors.skills && (
                                        <Text
                                            style={[
                                                globalStyles.text,
                                                { color: colors.dangerBorder },
                                            ]}
                                        >
                                            {fieldErrors.skills}
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
                                        Resumo / Sobre
                                    </Text>
                                    <TextInput
                                        placeholder="Conte um pouco sobre o perfil do cliente (opcional)."
                                        placeholderTextColor={colors.mutedText}
                                        value={form.resumo}
                                        onChangeText={(v) =>
                                            setForm((s) => ({ ...s, resumo: v }))
                                        }
                                        editable={!salvando && !loading}
                                        style={[
                                            globalStyles.input,
                                            {
                                                color: colors.text,
                                                backgroundColor: colors.surface,
                                                height: 100,
                                                textAlignVertical: "top",
                                            },
                                        ]}
                                        multiline
                                        numberOfLines={4}
                                    />
                                </View>

                                {/* Ações */}
                                <View style={listStyles.row}>
                                    <Pressable
                                        accessibilityRole="button"
                                        accessibilityLabel={
                                            isEdit
                                                ? "Atualizar cliente"
                                                : "Salvar cliente"
                                        }
                                        accessibilityHint="Valida os campos e envia os dados do cliente."
                                        android_ripple={{ color: colors.ripple }}
                                        disabled={salvando}
                                        style={[
                                            globalStyles.button,
                                            { backgroundColor: colors.button },
                                        ]}
                                        onPress={salvar}
                                    >
                                        <Text
                                            style={[
                                                globalStyles.buttonText,
                                                { color: colors.buttonText },
                                            ]}
                                        >
                                            {salvando
                                                ? "Salvando..."
                                                : isEdit
                                                    ? "Atualizar"
                                                    : "Salvar"}
                                        </Text>
                                    </Pressable>

                                    <Pressable
                                        accessibilityRole="button"
                                        accessibilityLabel="Voltar"
                                        android_ripple={{ color: colors.ripple }}
                                        style={[
                                            globalStyles.button,
                                            {
                                                backgroundColor: colors.surface,
                                                borderWidth: 1,
                                                borderColor: colors.border,
                                            },
                                        ]}
                                        onPress={() => router.back()}
                                    >
                                        <Text
                                            style={[
                                                globalStyles.buttonText,
                                                { color: colors.text },
                                            ]}
                                        >
                                            Voltar
                                        </Text>
                                    </Pressable>
                                </View>
                            </>
                        )}
                    </View>

                    {/* Excluir (somente em edição) */}
                    {isEdit && (
                        <View
                            style={[
                                formStyles.card,
                                {
                                    backgroundColor: colors.surface,
                                    borderColor: colors.border,
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    globalStyles.text,
                                    { color: colors.text, marginBottom: 8 },
                                ]}
                            >
                                Ações
                            </Text>
                            <Pressable
                                accessibilityRole="button"
                                accessibilityLabel="Excluir cliente"
                                accessibilityHint="Ação irreversível"
                                android_ripple={{ color: colors.ripple }}
                                onPress={excluir}
                                style={[
                                    formStyles.dangerBtn,
                                    {
                                        backgroundColor: colors.dangerBg,
                                        borderColor: colors.dangerBorder,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        globalStyles.buttonText,
                                        { color: "#fecaca" },
                                    ]}
                                >
                                    Excluir
                                </Text>
                            </Pressable>
                        </View>
                    )}

                    {/* Rodapé - Alternar tema */}
                    <View style={globalStyles.homeFooter}>
                        <ThemeToggleButton />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
