# Sistema de Gerenciamento de Pedidos

Este é um sistema simples de gerenciamento de pedidos desenvolvido com React e TailwindCSS. O aplicativo permite que os usuários listem, criem e visualizem detalhes dos pedidos.

## Estrutura do Projeto

```
order-management-frontend
├── index.html # Ponto de entrada HTML principal
├── package.json # Arquivo de configuração do NPM
├── tsconfig.json # Arquivo de configuração do TypeScript
├── vite.config.ts # Arquivo de configuração do Vite
├── tailwind.config.js # Arquivo de configuração do TailwindCSS
├── postcss.config.js # Arquivo de configuração do PostCSS
├── .gitignore # Arquivo de ignorar do Git
└── src
├── main.tsx # Ponto de entrada para o aplicativo React
├── App.tsx # Componente principal do aplicativo
├── index.css # Global Estilos CSS
├── páginas
│ ├── OrdersList.tsx # Componente para exibir uma lista de pedidos
│ ├── OrderCreate.tsx # Componente para criar novos pedidos
│ └── OrderDetails.tsx # Componente para visualizar detalhes do pedido
├── componentes
│ ├── OrderList.tsx # Renderiza a lista de pedidos
│ ├── OrderForm.tsx # Usado para criar ou editar pedidos
│ └── OrderCard.tsx # Representa um único pedido na lista
├── serviços
│ └── api.ts # Funções para fazer chamadas de API relacionadas a pedidos
├── hooks
│ └── useOrders.ts # Hook personalizado para gerenciar pedidos
├── types
│ └── order.ts # Interfaces TypeScript relacionadas a pedidos
└── utils
└── formatDate.ts # Função utilitária para formatar datas
```

## Começando

1. Clone o repositório:
```
git clone <url-do-repositório>
```

2. Navegue até o diretório do projeto:
```
cd order-management-frontend
```

3. Instale as dependências:
```
npm install
```

4. Inicie o servidor de desenvolvimento:
```
npm run dev
```

5. Abra seu navegador e acesse `http://localhost:3000` para ver o aplicativo em ação.

## Recursos

- Listar todos os pedidos
- Criar novos pedidos
- Ver detalhes de um pedido específico

## Tecnologias Utilizadas

- React
- TypeScript
- TailwindCSS
- Vite