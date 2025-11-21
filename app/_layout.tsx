import { Stack } from "expo-router";
import ThemeProvider from "../src/context/ThemeContext";

/* ============================================================
🗂️ Arquivo: Layout (app/_layout.tsx)
------------------------------------------------------------
Este arquivo define a estrutura GLOBAL do app utilizando o
Expo Router. Ele envolve todas as telas com os provedores
necessários para manter:

1. 🎨 Tema (ThemeProvider)
   - Contexto customizado para alternar entre
     tema claro e escuro.
   - Garante consistência visual em todas as telas.
   - O ThemeToggleButton acessa esse contexto.

2. 📱 Navegação (Stack do Expo Router)
   - Estrutura de navegação em pilha.
   - `headerShown: false` → remove o cabeçalho padrão.
   - Cada tela pode definir seu próprio header, se precisar.

============================================================ */

export default function Layout() {
    return (
        // 🎨 Provedor de tema (claro/escuro) envolvendo todo o app
        <ThemeProvider>
            {/* 📱 Stack de navegação sem cabeçalho padrão */}
            <Stack screenOptions={{ headerShown: false }} />
        </ThemeProvider>
    );
}
