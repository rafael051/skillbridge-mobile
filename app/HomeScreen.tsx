// File: app/HomeScreen.tsx
import React, { JSX } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Pressable,
    Alert,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteUser } from "firebase/auth";
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

import { auth } from "../src/services/firebaseConfig";
import globalStyles, { themedStyles } from "../src/styles/globalStyles";
import ThemeToggleButton from "../src/components/ThemeToggleButton";
import { useTheme } from "../src/context/ThemeContext";

/* =========================
   Tipos auxiliares
========================= */
type TileProps = {
    label: string;
    onPress: () => void;
    Icon: React.ComponentType;
    count?: number;
    t: ReturnType<typeof themedStyles>;
};

/* =========================
   Screen
========================= */
export default function HomeScreen(): JSX.Element {
    const { colors } = useTheme();
    const t = themedStyles(colors);

    /* =========================
       Autenticação / conta
    ========================= */
    const realizarLogoff = async () => {
        await AsyncStorage.removeItem("@user");
        router.replace("/");
    };

    const excluirConta = () => {
        Alert.alert(
            "Confirmar Exclusão",
            "Tem certeza que deseja excluir sua conta? Essa ação não poderá ser desfeita.",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const user = auth.currentUser;
                            if (!user) {
                                Alert.alert("Erro", "Nenhum usuário logado.");
                                return;
                            }
                            await deleteUser(user);
                            await AsyncStorage.removeItem("@user");
                            Alert.alert(
                                "Conta excluída",
                                "Sua conta foi excluída com sucesso."
                            );
                            router.replace("/");
                        } catch (error) {
                            console.log("Erro ao excluir conta", error);
                            Alert.alert(
                                "Erro",
                                "Não foi possível excluir a conta. Tente novamente."
                            );
                        }
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView
            style={[
                globalStyles.container,
                globalStyles.homeContainer,
                t.screenBackground,
            ]}
        >
            <KeyboardAvoidingView
                style={globalStyles.screenFill}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={20}
            >
                <ScrollView contentContainerStyle={globalStyles.homeScrollContent}>
                    {/* Cabeçalho */}
                    <View style={globalStyles.homeHeaderContainer}>
                        <View style={globalStyles.homeHeaderRow}>
                            <Ionicons
                                name="briefcase-outline"
                                size={26}
                                color={t.headerIcon.color}
                            />
                            <Text
                                style={[
                                    globalStyles.title,
                                    t.titleText,
                                ]}
                            >
                                SkillBridge
                            </Text>
                        </View>
                    </View>

                    {/* Grid de Módulos */}
                    <View style={globalStyles.homeGrid}>
                        {/* .NET CRUD principal (Clientes) */}
                        <Tile
                            label="Clientes"
                            // 👉 agora vai direto para a tela de lista
                            onPress={() => router.push("/clients/list")}
                            Icon={() => (
                                <Feather
                                    name="user"
                                    size={28}
                                    color={t.homeTileIcon.color}
                                />
                            )}
                            t={t}
                        />

                        {/* Vagas */}
                        <Tile
                            label="Vagas"
                            // idem: rota da lista de vagas
                            onPress={() => router.push("/jobs/list")}
                            Icon={() => (
                                <Feather
                                    name="briefcase"
                                    size={28}
                                    color={t.homeTileIcon.color}
                                />
                            )}
                            t={t}
                        />

                        {/* Recomendações */}
                        <Tile
                            label="Recomendações"
                            onPress={() => router.push("/recomendacao")}
                            Icon={() => (
                                <MaterialCommunityIcons
                                    name="lightbulb-on-outline"
                                    size={28}
                                    color={t.homeTileIcon.color}
                                />
                            )}
                            t={t}
                        />

                        {/* IA – endpoints da API FastAPI */}
                        <Tile
                            label="IA Currículo"
                            onPress={() => router.push("/ia/CurriculoScreen")}
                            Icon={() => (
                                <MaterialCommunityIcons
                                    name="file-document-edit-outline"
                                    size={28}
                                    color={t.homeTileIcon.color}
                                />
                            )}
                            t={t}
                        />

                        <Tile
                            label="IA Plano"
                            onPress={() => router.push("/ia/PlanoScreen")}
                            Icon={() => (
                                <MaterialCommunityIcons
                                    name="school-outline"
                                    size={28}
                                    color={t.homeTileIcon.color}
                                />
                            )}
                            t={t}
                        />

                        <Tile
                            label="IA Explain"
                            onPress={() => router.push("/ia/ExplainScreen")}
                            Icon={() => (
                                <Feather
                                    name="message-circle"
                                    size={28}
                                    color={t.homeTileIcon.color}
                                />
                            )}
                            t={t}
                        />

                        {/* Sobre */}
                        <Tile
                            label="Sobre"
                            onPress={() => router.push("/sobre")}
                            Icon={() => (
                                <MaterialCommunityIcons
                                    name="information-outline"
                                    size={28}
                                    color={t.homeTileIcon.color}
                                />
                            )}
                            t={t}
                        />
                    </View>

                    {/* Conta / Ações do usuário */}
                    <View style={t.accountSection}>
                        <Text
                            style={[
                                globalStyles.text,
                                t.centeredParagraph,
                            ]}
                        >
                            Você está logado.
                        </Text>

                        <Pressable
                            onPress={realizarLogoff}
                            style={[globalStyles.button, t.btnPrimary]}
                        >
                            <Text
                                style={[
                                    globalStyles.buttonText,
                                    t.btnPrimaryText,
                                ]}
                            >
                                Realizar logoff
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={() => router.push("/AlterarSenhaScreen")}
                            style={[globalStyles.button, t.btnWarning]}
                        >
                            <Text
                                style={[
                                    globalStyles.buttonText,
                                    t.btnWarningText,
                                ]}
                            >
                                Alterar senha
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={excluirConta}
                            style={[globalStyles.button, t.btnDangerOutline]}
                        >
                            <Text
                                style={[
                                    globalStyles.buttonText,
                                    t.btnDangerOutlineText,
                                ]}
                            >
                                Excluir conta
                            </Text>
                        </Pressable>
                    </View>

                    {/* Rodapé */}
                    <View style={globalStyles.homeFooter}>
                        <ThemeToggleButton />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

/* =========================
   Componentes
========================= */
function Tile({ label, count, onPress, Icon, t }: TileProps): JSX.Element {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                globalStyles.homeTile,
                t.homeTileSurface,
                pressed && t.homeTilePressed,
            ]}
        >
            <View style={globalStyles.homeTileIconWrap}>
                <Icon />
            </View>
            {Number.isFinite(count as number) && (
                <Text style={[globalStyles.homeTileCount, t.homeTileText]}>
                    {count}
                </Text>
            )}
            <Text style={[globalStyles.homeTileLabel, t.homeTileText]}>
                {label}
            </Text>
        </Pressable>
    );
}
