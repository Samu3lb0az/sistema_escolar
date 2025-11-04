# 📚 App Escola - Controle de Turmas

> Um sistema mobile para gerenciamento de turmas e atividades de professores, desenvolvido como exercício de fixação e aprofundamento do Curso Técnico de Desenvolvimento de Sistemas.

## 🧩 Descrição do Projeto

O **App Escola - Controle de Turmas** é um aplicativo móvel que permite a professores autenticarem-se, visualizarem, registrarem e excluírem suas turmas, além de cadastrarem atividades específicas para elas.

O projeto tem como principal objetivo solucionar a falta de organização de atividades e turmas em escolas, especialmente em regiões com infraestrutura limitada. Com uma interface simples e intuitiva, o aplicativo visa facilitar o gerenciamento das informações de cada turma e suas respectivas atividades, mantendo os dados centralizados e acessíveis apenas ao professor logado.

## 🖥️ Telas do Aplicativo

O projeto inclui três conjuntos principais de telas:

1.  **Autenticação (Login):** Tela inicial de login, com campos de e-mail e senha, além de mensagens de erro caso o login falhe.
2.  **Tela Principal e Gerenciamento de Turmas:** Tela principal do professor, mostrando a lista de turmas cadastradas, o modal de cadastro de nova turma e o modal de erro exibido ao tentar excluir uma turma com atividades associadas.
3.  **Tela de Atividades:** Tela exibindo todas as atividades vinculadas a uma turma específica e um modal para cadastro de novas atividades.

## 🛠️ Tecnologias Utilizadas

O aplicativo foi desenvolvido com as seguintes tecnologias:

* **React Native:** Framework principal para criação do app móvel.
* **Expo:** Ferramenta que simplifica o desenvolvimento e execução de projetos React Native.
* **Expo Router:** Organização das rotas e navegação entre telas.
* **Supabase:** Utilizado como backend e banco de dados.
* **TypeScript:** Tipagem estática para maior segurança e produtividade no código.
* **pnpm:** Gerenciador de pacotes rápido e eficiente.

## 🚀 Instalação e Execução

Siga os passos abaixo para configurar o ambiente de desenvolvimento e executar o projeto corretamente.

1.  Primeiro, clone o repositório:
    ```bash
    git clone https://github.com/Samu3lb0az/sistema_escolar.git
    ```

2.  Entre na pasta do projeto:
    ```bash
    cd clone-repositorio
    ```

3.  Em seguida, instale as dependências do projeto:
    ```bash
    pnpm install
    ```

4.  Para garantir as dependências compatíveis do Expo, execute:
    ```bash
    npx expo install react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-async-storage/async-storage @expo/vector-icons
    ```

5.  Instale o Supabase:
    ```bash
    pnpm add @supabase/supabase-js
    ```

6.  Opcionalmente, se necessário, instale manualmente os pacotes principais do projeto:
    ```bash
    pnpm add expo expo-router react react-dom react-native
    ```

7.  Para as dependências de desenvolvimento, use:
    ```bash
    pnpm add -D @babel/core @types/react @types/react-native typescript
    ```

8.  Por fim, execute o projeto:
    ```bash
    pnpm start
    ```

O Metro Bundler abrirá automaticamente no navegador, permitindo escanear o QR Code com o aplicativo Expo Go (Android) ou com o aplicativo Câmera (iOS) para executar o app diretamente em seu dispositivo móvel.

## 🧩 Desenvolvedores

- **Samuel Boaz**
  [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](www.linkedin.com/in/samuel-boaz-gonçalves)
  [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Samu3lb0az)

- **Andrey Montibeller**
  [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/andrey-montibeller/)
  [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/AndreyMonti)
