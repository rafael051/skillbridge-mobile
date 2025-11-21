// File: app/AlterarSenhaScreen.tsx
import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    Alert,
    ActivityIndicator,
} from "react-native";
import {
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider,
} from "firebase/auth";
import { useRouter } from "expo-router";

import { auth } from "../src/services/firebaseConfig";
import { useTheme } from "../src/context/ThemeContext";
import globalStyles, { themedStyles } from "../src/styles/globalStyles";
import ThemeToggleButton from "../src/components/ThemeToggleButton";

export default function AlterarSenhaScreen() {
    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    const router = useRouter();
    const { colors } = useTheme();
    const tStyles = themedStyles(colors);

    const mapFirebaseError = (code?: string) => {
        switch (code) {
            case "auth/wrong-password":
                return "Senha atual incorreta.";
            case "auth/too-many-requests":
                return "Muitas tentativas. Tente novamente mais tarde.";
            case "auth/weak-password":
                return "A nova senha é muito fraca. Use pelo menos 6 caracteres.";
            case "auth/requires-recent-login":
                return "Por segurança, faça login novamente antes de alterar a senha.";
            default:
                return "Não foi possível alterar a senha. Tente novamente.";
        }
    };

    const handleAlterarSenha = async () => {
        setErro(null);

        if (!senhaAtual || !novaSenha || !confirmarSenha) {
            setErro("Preencha todos os campos.");
            return;
        }

        if (novaSenha.length < 6) {
            setErro("A nova senha deve ter pelo menos 6 caracteres.");
            return;
        }

        if (novaSenha !== confirmarSenha) {
            setErro("A confirmação de senha não confere.");
            return;
        }

        try {
            setLoading(true);
            const user = auth.currentUser;
            if (!user || !user.email) {
                setErro("Nenhum usuário logado.");
                return;
            }

            const credential = EmailAuthProvider.credential(user.email, senhaAtual);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, novaSenha);

            Alert.alert("Sucesso", "Senha alterada com sucesso!");
            router.back();
        } catch (e: any) {
            const msg = mapFirebaseError(e?.code);
            setErro(msg);
            console.log("Erro ao alterar senha:", e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View
            style={[
                globalStyles.container,
                { backgroundColor: colors.background },
            ]}
        >
            <View style={globalStyles.authContainer}>
                {/* Título */}
                <Text
                    accessibilityRole="header"
                    style={[globalStyles.title, { color: colors.text }]}
                >
                    Alterar senha
                </Text>

                {/* Senha atual */}
                <View style={globalStyles.inputContainer}>
                    <Text
                        style={[globalStyles.inputLabel, { color: colors.text }]}
                    >
                        Senha atual
                    </Text>
                    <TextInput
                        style={[
                            globalStyles.input,
                            {
                                backgroundColor: colors.surface,
                                color: colors.text,
                                borderColor: colors.border,
                            },
                        ]}
                        placeholder="Digite sua senha atual"
                        placeholderTextColor={colors.mutedText ?? "#aaa"}
                        value={senhaAtual}
                        onChangeText={setSenhaAtual}
                        autoCapitalize="none"
                        secureTextEntry
                        returnKeyType="next"
                    />
                </View>

                {/* Nova senha */}
                <View style={globalStyles.inputContainer}>
                    <Text
                        style={[globalStyles.inputLabel, { color: colors.text }]}
                    >
                        Nova senha
                    </Text>
                    <TextInput
                        style={[
                            globalStyles.input,
                            {
                                backgroundColor: colors.surface,
                                color: colors.text,
                                borderColor: colors.border,
                            },
                        ]}
                        placeholder="Digite a nova senha"
                        placeholderTextColor={colors.mutedText ?? "#aaa"}
                        value={novaSenha}
                        onChangeText={setNovaSenha}
                        autoCapitalize="none"
                        secureTextEntry
                        returnKeyType="next"
                    />
                </View>

                {/* Confirmar nova senha */}
                <View style={globalStyles.inputContainer}>
                    <Text
                        style={[globalStyles.inputLabel, { color: colors.text }]}
                    >
                        Confirmar nova senha
                    </Text>
                    <TextInput
                        style={[
                            globalStyles.input,
                            {
                                backgroundColor: colors.surface,
                                color: colors.text,
                                borderColor: colors.border,
                            },
                        ]}
                        placeholder="Repita a nova senha"
                        placeholderTextColor={colors.mutedText ?? "#aaa"}
                        value={confirmarSenha}
                        onChangeText={setConfirmarSenha}
                        autoCapitalize="none"
                        secureTextEntry
                        returnKeyType="done"
                        onSubmitEditing={handleAlterarSenha}
                    />
                </View>

                {/* Erro */}
                {!!erro && <Text style={tStyles.errorText}>{erro}</Text>}

                {/* Botão Alterar Senha */}
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Alterar senha"
                    onPress={handleAlterarSenha}
                    disabled={loading}
                    style={[
                        globalStyles.button,
                        { opacity: loading ? 0.7 : 1 },
                        tStyles.btnPrimary,
                    ]}
                >
                    {loading ? (
                        <ActivityIndicator />
                    ) : (
                        <Text
                            style={[globalStyles.buttonText, tStyles.btnPrimaryText]}
                        >
                            Alterar senha
                        </Text>
                    )}
                </Pressable>

                {/* Voltar */}
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Voltar"
                    onPress={() => router.back()}
                    style={[
                        globalStyles.button,
                        tStyles.btnDangerOutline,
                        { borderColor: colors.border, borderWidth: 1 },
                    ]}
                >
                    <Text
                        style={[globalStyles.buttonText, { color: colors.text }]}
                    >
                        Voltar
                    </Text>
                </Pressable>

                {/* Rodapé — Alternar tema */}
                <View style={globalStyles.homeFooter}>
                    <ThemeToggleButton />
                </View>
            </View>
        </View>
    );
}
