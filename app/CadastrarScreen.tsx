// File: app/CadastrarScreen.tsx
import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";

import { auth } from "../src/services/firebaseConfig";
import { useTheme } from "../src/context/ThemeContext";
import globalStyles from "../src/styles/globalStyles";
import ThemeToggleButton from "../src/components/ThemeToggleButton";

export default function CadastrarScreen() {
    const { colors } = useTheme();
    const router = useRouter();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const handleCadastro = () => {
        if (!nome || !email || !senha) {
            Alert.alert("Atenção", "Preencha nome, e-mail e senha.");
            return;
        }

        createUserWithEmailAndPassword(auth, email, senha)
            .then(() => {
                Alert.alert("Sucesso", "Conta criada com sucesso!");
                router.push("/HomeScreen");
            })
            .catch((error) => {
                console.log("Erro ao cadastrar usuário:", error.message);
                Alert.alert(
                    "Erro",
                    "Não foi possível criar a conta. Verifique os dados e tente novamente."
                );
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
                    Criar conta
                </Text>
                <Text
                    style={[
                        globalStyles.subtitle,
                        { color: colors.mutedText, marginBottom: 16 },
                    ]}
                >
                    Cadastre-se para acessar o SkillBridge.
                </Text>

                {/* Nome */}
                <TextInput
                    style={[
                        globalStyles.input,
                        {
                            backgroundColor: colors.surface,
                            color: colors.text,
                            borderColor: colors.border,
                            borderWidth: 1,
                        },
                    ]}
                    placeholder="Nome completo"
                    placeholderTextColor={colors.mutedText ?? "#9AA0A6"}
                    value={nome}
                    onChangeText={setNome}
                />

                {/* E-mail */}
                <TextInput
                    style={[
                        globalStyles.input,
                        {
                            backgroundColor: colors.surface,
                            color: colors.text,
                            borderColor: colors.border,
                            borderWidth: 1,
                        },
                    ]}
                    placeholder="E-mail"
                    placeholderTextColor={colors.mutedText ?? "#9AA0A6"}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                />

                {/* Senha */}
                <TextInput
                    style={[
                        globalStyles.input,
                        {
                            backgroundColor: colors.surface,
                            color: colors.text,
                            borderColor: colors.border,
                            borderWidth: 1,
                        },
                    ]}
                    placeholder="Senha"
                    placeholderTextColor={colors.mutedText ?? "#9AA0A6"}
                    secureTextEntry
                    value={senha}
                    onChangeText={setSenha}
                />

                {/* Botão Cadastrar */}
                <TouchableOpacity
                    style={[globalStyles.button, { backgroundColor: colors.button }]}
                    onPress={handleCadastro}
                    activeOpacity={0.9}
                >
                    <Text
                        style={[
                            globalStyles.buttonText,
                            { color: colors.buttonText },
                        ]}
                    >
                        Cadastrar
                    </Text>
                </TouchableOpacity>

                {/* Alternar tema */}
                <ThemeToggleButton />
            </View>
        </View>
    );
}
