# 📱 Doamar App

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-0.81-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React Native">
  <img src="https://img.shields.io/badge/Expo-54.0-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo">
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Redux-5.0-764ABC?style=for-the-badge&logo=redux&logoColor=white" alt="Redux">
</p>

## 📋 Sobre o Projeto

**Doamar App** é um aplicativo móvel multiplataforma (iOS e Android) desenvolvido com React Native e Expo. O aplicativo conecta doadores com instituições beneficentes, permitindo que usuários façam doações, acompanhem causas sociais e interajam com organizações de forma simples e intuitiva.

### 🎯 Funcionalidades Principais

- ✅ Autenticação de usuários (Login/Registro)
- ✅ Perfil de usuário personalizável
- ✅ Listagem de instituições beneficentes
- ✅ Sistema de busca e filtros
- ✅ Favoritar instituições
- ✅ Realizar doações
- ✅ Acompanhar histórico de doações
- ✅ Mapa de localização de instituições
- ✅ Sistema de notificações
- ✅ Compartilhamento de causas
- ✅ Interface responsiva e intuitiva

## 🚀 Tecnologias Utilizadas

### Core
- **[React Native 0.81](https://reactnative.dev)** - Framework para desenvolvimento mobile
- **[Expo 54.0](https://expo.dev)** - Plataforma de desenvolvimento React Native
- **[TypeScript 5.9](https://www.typescriptlang.org)** - Superset JavaScript com tipagem estática

### State Management
- **[Redux Toolkit 2.2](https://redux-toolkit.js.org)** - Gerenciamento de estado
- **[Redux Saga 1.3](https://redux-saga.js.org)** - Middleware para efeitos colaterais
- **[Redux Persist 6.0](https://github.com/rt2zz/redux-persist)** - Persistência de estado

### UI & Styling
- **[NativeWind 4.0](https://www.nativewind.dev)** - TailwindCSS para React Native
- **[TailwindCSS 3.4](https://tailwindcss.com)** - Framework CSS utility-first
- **[Expo Linear Gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/)** - Gradientes
- **[React Navigation 6.1](https://reactnavigation.org)** - Navegação

### Features
- **[Axios 1.7](https://axios-http.com)** - Cliente HTTP
- **[Supabase JS 2.38](https://supabase.com)** - Backend as a Service
- **[React Native Maps 1.20](https://github.com/react-native-maps/react-native-maps)** - Mapas
- **[Expo Location](https://docs.expo.dev/versions/latest/sdk/location/)** - Geolocalização
- **[Expo Image Picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/)** - Seleção de imagens
- **[React Native Toast Message 2.2](https://github.com/calintamas/react-native-toast-message)** - Notificações toast

## 📦 Pré-requisitos

Antes de começar, verifique se você possui os seguintes requisitos instalados:

- Node.js >= 16.x
- npm >= 8.x ou Yarn >= 1.22
- Expo CLI (`npm install -g expo-cli`)
- Git

### Para desenvolvimento Android:
- Android Studio
- Java JDK 11 ou superior
- Android SDK

### Para desenvolvimento iOS (apenas macOS):
- Xcode 14 ou superior
- CocoaPods

## 🔧 Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd DoamarApp
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:
```env
EXPO_PUBLIC_API_URL=http://localhost:8000/api
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

4. **Inicie o projeto**
```bash
npm start
# ou
yarn start
```

## 🎮 Como Executar

### Modo Desenvolvimento

```bash
# Iniciar Metro Bundler
npm start

# Executar no Android
npm run android

# Executar no iOS (apenas macOS)
npm run ios

# Executar no navegador web
npm run web
```

### Modo Produção

```bash
# Build para Android
npm run prebuild
eas build --platform android

# Build para iOS (apenas macOS)
npm run prebuild
eas build --platform ios
```

## 📂 Estrutura do Projeto

```
DoamarApp/
├── src/
│   ├── api/              # Configurações e chamadas de API
│   ├── assets/           # Imagens, fontes e recursos estáticos
│   ├── components/       # Componentes reutilizáveis
│   ├── constants/        # Constantes da aplicação
│   ├── contexts/         # Contextos React
│   ├── core/             # Configurações principais
│   ├── mocks/            # Dados mocados para desenvolvimento
│   ├── routes/           # Configuração de navegação
│   ├── store/            # Redux store, actions, reducers, sagas
│   ├── styles/           # Estilos globais
│   └── types/            # Definições TypeScript
├── utils/                # Funções utilitárias
├── App.tsx               # Componente raiz da aplicação
├── app.json              # Configurações do Expo
├── eas.json              # Configurações EAS Build
├── tailwind.config.js    # Configurações TailwindCSS
└── tsconfig.json         # Configurações TypeScript
```

## 🧪 Executar Testes

```bash
# Executar linter
npm run lint

# Formatar código
npm run format
```

## 📱 Screenshots

<!-- Adicione screenshots do seu aplicativo aqui -->

## 🔗 API

Este aplicativo consome a **Doamar API**. Certifique-se de que a API está rodando e configure corretamente a URL no arquivo `.env`.

Para mais informações sobre a API, consulte: [DoamarAPI README](../DoamarAPI/README.md)

## 🤝 Como Contribuir

Contribuições são sempre bem-vindas! Para contribuir:

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças seguindo o padrão de commits
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### 📝 Padrão de Commits

Este projeto segue o padrão [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bugs
- `docs:` Alterações na documentação
- `style:` Alterações que não afetam o significado do código (formatação)
- `refactor:` Mudanças que não corrigem bugs nem adicionam funcionalidades
- `perf:` Melhorias de desempenho
- `test:` Adição ou modificação de testes
- `chore:` Tarefas auxiliares (mudanças em scripts de build ou configurações)

**Exemplo:**
```bash
git commit -m "feat: adicionar tela de histórico de doações"
git commit -m "fix: corrigir bug na autenticação"
git commit -m "docs: atualizar README com instruções de instalação"
```

## 🐛 Problemas Conhecidos

Se encontrar problemas durante a instalação ou execução:

### Cache do Metro Bundler
```bash
npm start -- --reset-cache
```

### Problemas com dependências nativas
```bash
npm run prebuild --clean
```

### Problemas com Expo
```bash
expo doctor
```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Equipe

Desenvolvido por estudantes da UNIP como projeto acadêmico.

## 📞 Suporte

Se precisar de ajuda, você pode:
- Abrir uma [issue](../../issues)
- Entrar em contato com a equipe de desenvolvimento

---

<p align="center">Feito com ❤️ para conectar doadores e instituições</p>