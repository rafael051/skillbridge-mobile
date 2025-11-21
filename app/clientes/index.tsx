// File: app/clients/index.tsx
import { Redirect } from "expo-router";

/**
 * Alias de rota:
 * Ao acessar /clients, redireciona imediatamente para /clients/list
 * usando replace (sem poluir o histórico).
 */
export default function ClientsIndex() {
    return <Redirect href="/clients/list" />;
}
