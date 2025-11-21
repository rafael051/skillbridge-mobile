import { Link, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

import { auth } from "../src/services/firebaseConfig";
import { useTheme } from "../src/context/ThemeContext";
import ThemeToggleButton from "../src/components/ThemeToggleButton";
import globalStyles from "../src/styles/globalStyles";

export default function LoginScreen() {
    const { colors } = useTheme();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const router = useRouter();

    // Verifica se já existe usuário logado
    const verificarUsuarioLogado = async () => {
        try {
            const usuarioSalvo = await AsyncStorage.getItem("@user");
            if (usuarioSalvo) {
                router.push("/HomeScreen");
            }
        } catch (error) {
            console.log("Erro ao verificar login", error);
        }
    };

    useEffect(() => {
        verificarUsuarioLogado();
    }, []);

    // Login com Firebase
    const handleLogin = () => {
        if (!email || !senha) {
            Alert.alert("Atenção", "Preencha todos os campos.");
            return;
        }

        signInWithEmailAndPassword(auth, email, senha)
            .then(async (userCredential) => {
                const user = userCredential.user;
                await AsyncStorage.setItem("@user", JSON.stringify(user));
                router.push("/HomeScreen");
            })
            .catch((error) => {
                if (error.code === "auth/invalid-credential") {
                    Alert.alert("Atenção", "E-mail ou senha incorretos, verifique.");
                } else {
                    console.log("Erro:", error.message);
                    Alert.alert("Erro", "Não foi possível realizar o login.");
                }
            });
    };

    // Resetar senha
    const esqueceuSenha = () => {
        if (!email) {
            Alert.alert("Atenção", "Digite o e-mail para recuperar a senha.");
            return;
        }

        sendPasswordResetEmail(auth, email)
            .then(() => {
                Alert.alert("Sucesso", "E-mail de recuperação enviado.");
            })
            .catch((error) => {
                console.log("Erro:", error.message);
                Alert.alert("Erro", "Não foi possível enviar o e-mail de reset.");
            });
    };

    return (
        <View
            style={[
                globalStyles.container,
                { backgroundColor: colors.background },
            ]}
        >
            <View style={globalStyles.authContainer}>
                <Text style={[globalStyles.title, { color: colors.text }]}>
                    SkillBridge
                </Text>
                <Text
                    style={[
                        globalStyles.subtitle,
                        { color: colors.mutedText, marginBottom: 16 },
                    ]}
                >
                    Faça login para acessar vagas, clientes e recomendações.
                </Text>

                {/* Inputs */}
                <TextInput
                    style={[
                        globalStyles.input,
                        {
                            color: colors.text,
                            borderWidth: 1,
                            borderColor: colors.border,
                        },
                    ]}
                    placeholder="E-mail"
                    placeholderTextColor={colors.mutedText}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TextInput
                    style={[
                        globalStyles.input,
                        {
                            color: colors.text,
                            borderWidth: 1,
                            borderColor: colors.border,
                        },
                    ]}
                    placeholder="Senha"
                    placeholderTextColor={colors.mutedText}
                    secureTextEntry
                    value={senha}
                    onChangeText={setSenha}
                />

                {/* Botão Login */}
                <TouchableOpacity
                    style={[globalStyles.button, { backgroundColor: colors.button }]}
                    onPress={handleLogin}
                >
                    <Text
                        style={[
                            globalStyles.buttonText,
                            { color: colors.buttonText },
                        ]}
                    >
                        Entrar
                    </Text>
                </TouchableOpacity>

                {/* Alternar tema */}
                <ThemeToggleButton />

                {/* Links */}
                <Link
                    href="CadastrarScreen"
                    style={[globalStyles.link, { color: colors.text }]}
                >
                    Não tem conta? Cadastre-se
                </Link>

                <Text
                    style={[globalStyles.forgotPassword, { color: colors.text }]}
                    onPress={esqueceuSenha}
                >
                    Esqueceu a senha?
                </Text>
            </View>
        </View>
    );
}
