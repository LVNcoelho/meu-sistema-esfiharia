# meu-sistema-esfiharia
resolvi treinar algumas habilidades com a ajuda da IA para criar um sistema de fluxo de caixa e compra de materiais.
# Sistema de Gestão da Esfiharia

Este é um sistema simples de gestão para uma esfiharia, desenvolvido em Node.js.

## Funcionalidades

* Registro de novos pedidos (unidades avulsas ou combos).
* Registro de novas compras de materiais (gastos).
* Visualização do resumo financeiro diário (ganhos vs. gastos).

## Tecnologias Utilizadas

* Node.js
* Firebase Firestore (para banco de dados)
* Módulo `readline` do Node.js (para interação via terminal)

## Como Configurar e Executar

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/LVNcoelho/meu-sistema-esfiharia.git](https://github.com/LVNcoelho/meu-sistema-esfiharia.git)
    ```

2.  **Navegue até a pasta do projeto:**
    ```bash
    cd meu-sistema-esfiharia
    ```

3.  **Instale as dependências:**
    ```bash
    npm install firebase-admin
    ```

4.  **Configuração do Firebase:**
    * Crie um projeto no Firebase Console.
    * Gere um arquivo de chave de serviço (Service Account Key) e salve-o como `esfiharia-pontense-delivery-firebaseKey.json` na raiz do seu projeto. **ATENÇÃO: Este arquivo contém informações sensíveis e NÃO deve ser enviado para repositórios públicos.**

5.  **Execute o aplicativo:**
    ```bash
    node app.js
    ```

## Como Usar

Após iniciar o aplicativo, você verá um menu no terminal:

1.  Registrar Novo Pedido
2.  Registrar Nova Compra de Material
3.  Ver Resumo do Dia
4.  Sair

Siga as instruções no terminal para interagir com o sistema.

## Contato

Pâmela 91 - 8580-0931