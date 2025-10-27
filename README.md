# API de Pedidos Gerados + Worker

Esta é uma solução .NET 8 gerada com uma API de Pedidos e um Worker em segundo plano que processa mensagens de pedidos via Barramento de Serviço do Azure e persiste os pedidos no PostgreSQL.

Recursos:
- POST /orders: cria pedido (status inicial = Pendente)
- GET /orders: lista pedidos
- GET /orders/{id}: obtém detalhes do pedido
- Publicador do Barramento de Serviço do Azure na criação
- Worker consome mensagens, atualiza o status Pendente -> Processando -> Finalizado
- EF Core com PostgreSQL
- Verificações de integridade para API, BD e Barramento de Serviço
- Docker Compose com api, worker, postgres e pgadmin

Início rápido (requer Docker):
1. Copie `.env.example` para `.env` e ajuste os valores.
2. A partir desta pasta, execute:

```powershell
docker compose up --build
```

A API estará disponível em `http://localhost:5000` (ou por portas do docker-compose).

O frontend estará disponível em `http://localhost:3000` assim que o serviço `frontend` for criado pelo docker-compose.

Para desenvolvimento frontend local (sem docker):

```bash
cd order-management-frontend
npm install
# create .env with VITE_API_URL=http://localhost:5000
npm run dev
```

Modo de Desenvolvimento (Sem Barramento de Serviço do Azure):
- Quando `AZURE_SERVICEBUS_CONNECTIONSTRING` estiver vazio ou não definido:
- A API registrará as mensagens localmente em vez de publicá-las no Azure
- O Worker processará os pedidos diretamente do banco de dados
- Os pedidos ainda transitarão por todos os estados: Pendente → Processando → Finalizado
- O sistema está totalmente funcional para desenvolvimento e testes

Testando o Fluxo:
1. Crie um pedido:
```bash
curl -X POST http://localhost:5000/orders \
-H "Content-Type: application/json" \
-d '{
"cliente": "João Silva",
"produto": "Produto Teste",
"valor": 99,90
}'
```

2. Observe os logs do Worker:
```bash
docker compose logs -f worker
```

3. Verifique o status do pedido:
```bash
curl http://localhost:5000/orders
```

Observação: para implantação em produção, você precisará configurar o Barramento de Serviço do Azure.