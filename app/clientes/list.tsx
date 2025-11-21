// File: app/clients/list.tsx
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    View,
    Text,
    ActivityIndicator,
    Alert,
    FlatList,
    Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../../src/context/ThemeContext";
import globalStyles, { listStyles } from "../../src/styles/globalStyles";
import ThemeToggleButton from "../../src/components/ThemeToggleButton";

/* ============================================================================
   Tipo básico de Cliente (por enquanto local / mock)
   ============================================================================ */
type Client = {
    id: number;
    nome: string;
    email: string;
    telefone?: string;
    skills?: string;
    resumo?: string;
};

/* ============================================================================
   Lista de Clientes (sem i18n / sem API)
   ============================================================================ */
export default function ClientsList() {
    const { colors } = useTheme();
    const router = useRouter();

    const [itens, setItens] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    /* ============================================================================
       Carregar lista (por enquanto dados mock / local)
       ============================================================================ */
    const carregar = useCallback(async () => {
        setErro(null);
        setLoading(true);

        try {
            // 👉 Por enquanto usando MOCK. Depois a gente troca para chamada da API.
            const mock: Client[] = [
                {
                    id: 1,
                    nome: "Ana Souza",
                    email: "ana.souza@example.com",
                    telefone: "(11) 99888-0000",
                    skills: "Java, Spring, SQL",
                    resumo: "Desenvolvedora backend júnior.",
                },
                {
                    id: 2,
                    nome: "Carlos Lima",
                    email: "carlos.lima@example.com",
                    telefone: "(11) 97777-1111",
                    skills: "React, TypeScript, UX",
                    resumo: "Frontend focado em experiência do usuário.",
                },
            ];

            setItens(mock);
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : String(e);
            console.log("Erro ao carregar clientes (mock):", message);
            setErro("Falha ao carregar clientes.");
            setItens([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Recarrega sempre que a tela ganha foco
    useFocusEffect(
        useCallback(() => {
            void carregar();
            return undefined;
        }, [carregar])
    );

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await carregar();
        setRefreshing(false);
    }, [carregar]);

    const novo = () => router.push("/clients/form");

    const editar = (id: number) =>
        router.push({ pathname: "/clients/form", params: { id: String(id) } });

    const excluir = async (id: number) => {
        const ok = await new Promise<boolean>((resolve) => {
            Alert.alert(
                "Confirmar exclusão?",
                "Essa ação não poderá ser desfeita.",
                [
                    {
                        text: "Cancelar",
                        style: "cancel",
                        onPress: () => resolve(false),
                    },
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
            setDeletingId(id);
            // 👉 Por enquanto apenas removendo do estado local
            setItens((prev) => prev.filter((c) => c.id !== id));
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : String(e);
            console.log("Erro ao excluir cliente (mock):", message);
            Alert.alert("Erro", "Não foi possível excluir o cliente.");
        } finally {
            setDeletingId(null);
        }
    };

    const renderItem = ({ item }: { item: Client }) => {
        const isDeleting = deletingId === item.id;

        return (
            <Pressable
                android_ripple={{ color: colors.ripple }}
                onPress={() => editar(item.id)}
                accessibilityRole="button"
                accessibilityLabel={`Editar cliente ${item.nome}`}
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
                        #{item.id} • {item.nome}
                    </Text>
                    <Text style={[globalStyles.text, { color: colors.text }]}>
                        E-mail: {item.email}
                    </Text>
                    {item.telefone && (
                        <Text
                            style={[globalStyles.text, { color: colors.mutedText }]}
                        >
                            Tel: {item.telefone}
                        </Text>
                    )}
                    {item.skills && (
                        <Text
                            style={[globalStyles.text, { color: colors.mutedText }]}
                            numberOfLines={1}
                        >
                            Skills: {item.skills}
                        </Text>
                    )}
                    {item.resumo && (
                        <Text
                            style={[globalStyles.text, { color: colors.mutedText }]}
                            numberOfLines={2}
                        >
                            {item.resumo}
                        </Text>
                    )}
                </View>

                <View style={{ gap: 8 }}>
                    <Pressable
                        android_ripple={{ color: colors.ripple }}
                        onPress={() => editar(item.id)}
                        disabled={isDeleting}
                        style={[
                            listStyles.smallBtn,
                            {
                                backgroundColor: colors.surface,
                                borderColor: colors.border,
                                opacity: isDeleting ? 0.6 : 1,
                            },
                        ]}
                    >
                        <Text style={{ color: colors.text }}>
                            {isDeleting ? "..." : "Editar"}
                        </Text>
                    </Pressable>

                    <Pressable
                        android_ripple={{ color: colors.ripple }}
                        onPress={() => excluir(item.id)}
                        disabled={isDeleting}
                        style={[
                            listStyles.smallBtnDanger,
                            {
                                backgroundColor: colors.dangerBg,
                                borderColor: colors.dangerBorder,
                                opacity: isDeleting ? 0.6 : 1,
                            },
                        ]}
                    >
                        <Text style={{ color: "#fecaca" }}>
                            {isDeleting ? "Excluindo..." : "Excluir"}
                        </Text>
                    </Pressable>
                </View>
            </Pressable>
        );
    };

    const keyExtractor = useCallback((item: Client) => String(item.id), []);

    return (
        <SafeAreaView
            style={[globalStyles.container, { backgroundColor: colors.background }]}
        >
            <View>
                {/* Cabeçalho */}
                <View>
                    <Text
                        accessibilityRole="header"
                        style={[globalStyles.title, { color: colors.text }]}
                    >
                        🧑‍💼 Clientes
                    </Text>
                    <Text
                        style={[
                            globalStyles.text,
                            { color: colors.mutedText, marginBottom: 8 },
                        ]}
                    >
                        Gerencie os clientes da plataforma.
                    </Text>
                </View>

                {/* Ações topo */}
                <View style={listStyles.row}>
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Voltar"
                        accessibilityHint="Retorna para a tela anterior"
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

                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Cadastrar novo cliente"
                        android_ripple={{ color: colors.ripple }}
                        style={[
                            globalStyles.button,
                            { backgroundColor: colors.button },
                        ]}
                        onPress={novo}
                    >
                        <Text
                            style={[
                                globalStyles.buttonText,
                                { color: colors.buttonText },
                            ]}
                        >
                            ➕ Novo
                        </Text>
                    </Pressable>

                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Atualizar lista de clientes"
                        android_ripple={{ color: colors.ripple }}
                        style={[
                            globalStyles.button,
                            {
                                backgroundColor: colors.surface,
                                borderWidth: 1,
                                borderColor: colors.border,
                            },
                        ]}
                        onPress={carregar}
                    >
                        <Text
                            style={[
                                globalStyles.buttonText,
                                { color: colors.text },
                            ]}
                        >
                            Atualizar
                        </Text>
                    </Pressable>
                </View>

                {/* Lista */}
                <View
                    style={[
                        listStyles.cardOutlined,
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

                            <FlatList
                                data={itens}
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
                                        Nenhum cliente cadastrado.
                                    </Text>
                                }
                                renderItem={renderItem}
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        </>
                    )}
                </View>

                {/* Rodapé – Alternar tema */}
                <View style={globalStyles.homeFooter}>
                    <ThemeToggleButton />
                </View>
            </View>
        </SafeAreaView>
    );
}
