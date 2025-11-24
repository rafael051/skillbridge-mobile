
# 📱 SkillBridge Mobile – App React Native (Expo)

Aplicativo mobile desenvolvido em **React Native com Expo** para a plataforma **SkillBridge**, integrando:

- Autenticação segura com **Firebase Auth (e-mail/senha)**;
- Consumo da **API .NET SkillBridge** (módulos de negócio como Clientes e Vagas);
- Consumo da **API de IA SkillBridge AI (FastAPI + OpenAI)** para:
    - geração de **planos de requalificação / carreira**;
    - criação de **currículos em HTML** prontos para impressão/compartilhamento;
    - explicações em linguagem simples de vagas/perfis (**Explain**);
- Interface moderna com **tema claro/escuro** e navegação via **Expo Router**.

> Projeto focado em entrega acadêmica (FIAP 2025), com código organizado por telas, serviços e contexto de tema.

---

## 🧱 Stack principal

- **React Native** `0.81.x`
- **Expo SDK** `54`
- **React** `19`
- **Expo Router** `6`
- **Firebase (Auth)**
- **Axios** para consumo das APIs (.NET e IA)
- **AsyncStorage** para persistência de sessão/usuário
- **Expo Print** / **Expo Sharing** para exportar e compartilhar o currículo em PDF

Dependências principais (trecho do `package.json`):

- `expo`, `react-native`, `react`, `expo-router`
- `firebase`
- `@react-native-async-storage/async-storage`
- `axios`
- `expo-print`, `expo-sharing`
- `react-native-safe-area-context`, `react-native-screens`
- `@expo/vector-icons`

---

## 📂 Estrutura de pastas (simplificada)

```text
skillbridge-mobile/
├─ app/
│  ├─ _layout.tsx          # Layout de navegação (Expo Router)
│  ├─ index.tsx            # Tela de Login (Firebase)
│  ├─ HomeScreen.tsx       # Dashboard / menu principal
│  ├─ CadastrarScreen.tsx  # Cadastro de novo usuário (Firebase)
│  ├─ AlterarSenhaScreen.tsx # Alterar senha / exclusão de conta
│  ├─ ia/
│  │  ├─ PlanoScreen.tsx       # Geração de plano de carreira (IA)
│  │  ├─ CurriculoScreen.tsx   # Formulário de dados do currículo
│  │  ├─ ExplainScreen.tsx     # Explain (explicar vaga/perfil/competências)
│  │  ├─ cv-preview.tsx        # Preview/Impressão/Compartilhamento de CV
│  │  ├─ plan-preview.tsx      # Preview do plano de carreira
│  │  └─ explain-preview.tsx   # Preview da explicação gerada
│  ├─ recomendacao/
│  │  └─ index.tsx          # Tela de recomendações de vagas
│  └─ sobre/
│     └─ index.tsx          # Tela "Sobre o App" (commit hash FIAP)
│
├─ src/
│  ├─ components/
│  │  └─ ThemeToggleButton.jsx  # Botão para alternar tema claro/escuro
│  ├─ context/
│  │  └─ ThemeContext.jsx       # Contexto para tema (light/dark)
│  ├─ services/
│  │  ├─ firebaseConfig.tsx     # Configuração do Firebase (Auth)
│  │  ├─ skillbridgeApi.ts      # Cliente Axios para API .NET SkillBridge
│  │  └─ skillbridgeAiApi.ts    # Cliente Axios para API SkillBridge AI (FastAPI)
│  └─ styles/
│     └─ globalStyles.ts        # Estilos globais (layout, botões, cards, etc.)
│
├─ App.tsx
├─ app.json
├─ package.json
└─ tsconfig.json / etc.
```

---

## ✨ Funcionalidades

### 🔐 Autenticação (Firebase Auth)

- Login com **e-mail e senha**;
- Cadastro de novo usuário (tela **CadastrarScreen**);
- Recuperação de senha via e-mail (link de redefinição);
- Alteração de senha após logado;
- Opção de **exclusão da conta**;
- Persistência de sessão usando `AsyncStorage` para manter o usuário logado;
- Botão de **logout** com limpeza da sessão e volta para a tela de login.

Toda a autenticação está centralizada em:

- `src/services/firebaseConfig.tsx` – inicialização do Firebase e export do `auth`;
- `app/index.tsx` – fluxo de login, validação e navegação;
- `app/CadastrarScreen.tsx` – fluxo de registro;
- `app/AlterarSenhaScreen.tsx` – alteração de senha e exclusão de conta.

---

### 🏠 Home / Dashboard

A tela **HomeScreen.tsx** exibe cards organizados em grade, com ícones e descrições curtas, permitindo navegar rapidamente para:

- **Clientes** (CRUD consumindo a API .NET SkillBridge);
- **Vagas** (CRUD/consulta de vagas na API .NET SkillBridge);
- **Recomendações** (tela que sugere vagas a partir do perfil informado);
- **IA Plano** (geração de plano de carreira);
- **IA Currículo** (formulário de dados pessoais / profissionais para montar o CV);
- **IA Explain** (explicar vaga, competências ou requisitos em linguagem simples);
- **Sobre o App** (informações da versão e hash do commit exigido pela FIAP);
- Atalhos para **Alterar Senha** e **Logout**.

> Toda a identidade visual (botões, cards, textos) é centralizada em `src/styles/globalStyles.ts`, com variações para tema claro/escuro definidas em `ThemeContext`.

---

### 🤖 Integração com API SkillBridge AI (FastAPI + OpenAI)

O arquivo `src/services/skillbridgeAiApi.ts` encapsula o cliente Axios para a **API de IA SkillBridge AI**, com os principais tipos e endpoints:

- `GET /health` – status da API e modelo de IA carregado;
- `POST /gen/plan` – recebe um objeto com dados do perfil e retorna um **plano de requalificação/carreira**;
- `POST /gen/cv/html` – recebe um objeto com dados do currículo e retorna **HTML pronto** para renderização;
- `POST /gen/cv/html/demo` – variação de demonstração para testes;
- `POST /gen/explain/html` – recebe contexto (vaga, requisitos, texto técnico) e devolve explicações em linguagem acessível.

As telas que consomem essa API são:

- `app/ia/PlanoScreen.tsx` + `plan-preview.tsx`;
- `app/ia/CurriculoScreen.tsx` + `cv-preview.tsx`;
- `app/ia/ExplainScreen.tsx` + `explain-preview.tsx`.

No preview do currículo (`cv-preview.tsx`), é possível:

- **Imprimir**/gerar PDF usando `expo-print`;
- **Compartilhar** o PDF gerado usando `expo-sharing` (e.g., enviar por e-mail, WhatsApp, etc.).

---

### 🌐 Integração com API .NET SkillBridge

O arquivo `src/services/skillbridgeApi.ts` encapsula o cliente Axios para a **API .NET SkillBridge**, incluindo:

- configuração de **base URL**;
- inclusão opcional de **JWT** via `Authorization: Bearer ...`;
- funções utilitárias para chamadas REST (por exemplo, endpoints de Clientes e Vagas).

O app foi pensado para consumir os módulos principais da API:

- **Clientes** – cadastro e manutenção de clientes da plataforma SkillBridge;
- **Vagas** – cadastro/listagem de vagas para recomendações e IA.

> A base de URL e o token JWT podem ser configurados em tempo de execução, permitindo usar diferentes ambientes (local, Azure, Render, etc.).

---

### 🎨 Tema Claro/Escuro

- Implementado via `src/context/ThemeContext.jsx`;
- O componente `ThemeToggleButton` aparece em praticamente todas as telas principais;
- As cores do tema alimentam estilos dinâmicos em `globalStyles.ts` (botões, textos, cards, ícones).

---

## ⚙️ Configuração – Pré-requisitos

Antes de rodar o projeto, certifique-se de ter instalado:

- **Node.js** (recomendado LTS, ex: 20.x);
- **npm** ou **yarn**;
- **Git** (opcional, mas recomendado);
- App **Expo Go** no seu dispositivo físico (Android/iOS) se desejar testar via QR Code.

---

## 🔑 Configurando o Firebase (Auth)

1. Crie um projeto no **Firebase Console** (https://console.firebase.google.com).
2. Ative o módulo **Authentication** com o provedor **E-mail/Senha**.
3. Na aba **Configurações do projeto → Suas apps**, crie um app Web e copie o objeto de configuração
   (`apiKey`, `authDomain`, `projectId`, etc.).
4. Abra o arquivo `src/services/firebaseConfig.tsx` e substitua o bloco de configuração pelo seu:

   ```ts
   // Exemplo de estrutura:
   const firebaseConfig = {
     apiKey: "SUA_API_KEY",
     authDomain: "seu-projeto.firebaseapp.com",
     projectId: "seu-projeto",
     storageBucket: "seu-projeto.appspot.com",
     messagingSenderId: "1234567890",
     appId: "1:1234567890:web:abcdef123456",
   };

   const app = initializeApp(firebaseConfig);
   export const auth = getAuth(app);
   ```

5. Salve o arquivo. A partir disso, telas de **login**, **cadastro** e **alterar senha** já passam a funcionar
   contra o seu projeto Firebase.

> **Dica:** para um projeto público, considere mover essas chaves para variáveis de ambiente do Expo (`EXPO_PUBLIC_*`)
> ou usar secrets no CI/CD.

---

## 🌐 Configurando as APIs (Base URLs)

### 1) API .NET SkillBridge

A base da API .NET é configurada em `src/services/skillbridgeApi.ts`, com comportamento padrão:

- Se **NÃO** houver variável de ambiente `EXPO_PUBLIC_SKILLBRIDGE_API_BASE`, o código usa valores padrão:
    - `http://localhost:5028` (para web/iOS no mesmo PC);
    - `http://10.0.2.2:5028` (Android Emulator);
    - ou o IP da sua LAN para dispositivo físico.

Para explicitar a base via ambiente, você pode executar o Expo assim:

#### Windows (PowerShell)

```powershell
$env:EXPO_PUBLIC_SKILLBRIDGE_API_BASE="http://192.168.0.10:5028"
npx expo start
```

#### Linux/macOS (bash/zsh)

```bash
EXPO_PUBLIC_SKILLBRIDGE_API_BASE="http://192.168.0.10:5028" npx expo start
```

A API .NET deve expor endpoints REST para os módulos de negócio usados pelo app (clientes, vagas, etc.).

> Se a API utilizar **JWT**, após o login você pode chamar `setAuthToken(token)` (do próprio `skillbridgeApi.ts`)
> para que o header `Authorization: Bearer ...` seja incluído automaticamente em todas as requisições.

---

### 2) API de IA SkillBridge (FastAPI)

A base da API de IA é configurada em `src/services/skillbridgeAiApi.ts`:

- Por padrão, se não houver `EXPO_PUBLIC_IA_BASE`, a constante `IA_BASE` começa em `http://10.0.2.2:8080` (bom para
  rodar o backend IA em `localhost:8080` e acessar pelo emulador Android).

Para apontar para um backend em nuvem (por exemplo, Render/Azure) ou outra porta, use:

#### Windows (PowerShell)

```powershell
$env:EXPO_PUBLIC_IA_BASE="https://skillbridge-ai.onrender.com"
npx expo start
```

#### Linux/macOS (bash/zsh)

```bash
EXPO_PUBLIC_IA_BASE="https://skillbridge-ai.onrender.com" npx expo start
```

> Certifique-se de que sua API de IA esteja preparada para CORS (origens do Expo e do navegador),
> e que os endpoints `/health`, `/gen/plan`, `/gen/cv/html` e `/gen/explain/html` estejam publicados.

---

## 🚀 Como executar o projeto (desenvolvimento)

1. Clone o repositório ou copie os arquivos do projeto:

   ```bash
   git clone https://seu-repo.git
   cd skillbridge-mobile
   ```

2. Instale as dependências:

   ```bash
   npm install
   # ou
   yarn
   ```

3. Configure o **Firebase** em `src/services/firebaseConfig.tsx` (conforme seção anterior).

4. Opcionalmente, configure as variáveis de ambiente para as bases das APIs:

   ```bash
   # Exemplo (Linux/macOS)
   EXPO_PUBLIC_SKILLBRIDGE_API_BASE="http://192.168.0.10:5028"    EXPO_PUBLIC_IA_BASE="https://skillbridge-ai.onrender.com"    npx expo start
   ```

5. Inicie o projeto com o Expo:

   ```bash
   npx expo start
   ```

6. Escolha onde rodar:

    - **a)** Scanner o QR Code com o app **Expo Go** (Android/iOS);
    - **b)** Pressionar `a` para abrir no **Android Emulator**;
    - **c)** Pressionar `w` para abrir no navegador (modo web).

---

## 🧪 Roteiro de testes sugerido (FIAP / Avaliação)

1. **Login e Cadastro**
    - Abrir o app → tela de login;
    - Clicar em “Criar conta” → preencher dados válidos → retornar e logar;
    - Testar fluxo de “Esqueci minha senha” (envio de e-mail pelo Firebase).

2. **Home e Navegação**
    - Após login, validar se os cards da Home aparecem corretamente;
    - Alternar entre tema claro/escuro pelo botão de tema no cabeçalho;
    - Navegar até a tela “Sobre o App” e conferir se o **hash do commit** está preenchido.

3. **Módulo IA – Plano**
    - Acessar **IA Plano**;
    - Informar área de interesse, tempo disponível, tecnologias, etc.;
    - Gerar plano e visualizar no preview;
    - Voltar para ajustar parâmetros e gerar outro plano.

4. **Módulo IA – Currículo**
    - Acessar **IA Currículo**;
    - Preencher dados pessoais, formação, experiências e skills;
    - Gerar CV e visualizar na **cv-preview**;
    - Testar **impressão/exportação para PDF** e **compartilhamento** (Expo Print + Sharing).

5. **Módulo IA – Explain**
    - Acessar **IA Explain**;
    - Colar a descrição de uma vaga ou texto técnico;
    - Gerar explicações em linguagem simples e conferir o preview.

6. **Recomendações / Módulos .NET**
    - Acessar a tela **Recomendações** e validar o fluxo de consulta;
    - Acessar as telas de negócio (Clientes, Vagas), caso configuradas,
      verificando se a API .NET está respondendo.

7. **Sessão**
    - Testar **logout**;
    - Testar fluxo de **Alterar Senha**;
    - Testar **exclusão de conta** (se habilitada no Firebase).

---

## 📝 Notas importantes

- Este projeto foi organizado para ser facilmente demonstrável em **vídeo de até 5 minutos**, cobrindo:
    - login/cadastro;
    - navegação na Home;
    - uso de pelo menos **um CRUD da API .NET**;
    - uso de **um ou mais módulos de IA**;
    - tema claro/escuro;
    - impressão/compartilhamento do currículo.

- Ajuste o valor de `COMMIT_HASH` na tela `app/sobre/index.tsx` para refletir o hash do commit publicado no GitHub, conforme exigência da FIAP.

---

## 📚 Próximos passos / extensões

- Adicionar mais módulos da API .NET (ex.: histórico de candidaturas, skills, etc.);
- Implementar cache local de respostas da IA para funcionar melhor offline;
- Melhorar internacionalização (i18n) para suportar inglês/espanhol;
- Integrar analytics (por exemplo, Firebase Analytics) para mapear uso das funcionalidades.

---

## 👨‍💻 Autor

Projeto desenvolvido para a **Global Solution FIAP 2025** e disciplinas de **Mobile Application Development** e integrações com **.NET / Java / IA em nuvem (OpenAI)**.

Sinta-se à vontade para adaptar este README, incluir prints de tela e detalhar os fluxos de negócio específicos usados na sua entrega.
