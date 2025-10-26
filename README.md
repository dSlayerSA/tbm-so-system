# Generated Orders API + Worker

This is a generated .NET 8 solution with an Orders API and a background Worker that processes order messages via Azure Service Bus and persists orders in PostgreSQL.

Features:
- POST /orders : create order (initial status = Pendente)
- GET /orders : list orders
- GET /orders/{id} : get order details
- Azure Service Bus publisher on create
- Worker consumes messages, updates status Pendente -> Processando -> Finalizado
- EF Core with PostgreSQL
- Health checks for API, DB, and Service Bus
- Docker Compose with api, worker, postgres and pgadmin

Quick start (requires Docker):
1. Copy `.env.example` to `.env` and adjust values.
2. From this folder run:

```powershell
docker compose up --build
```

API will be available at `http://localhost:5000` (or per docker-compose ports).

Frontend will be available at `http://localhost:3000` once the `frontend` service is built by docker-compose.

For local frontend development (without docker):

```bash
cd order-management-frontend
npm install
# create .env with VITE_API_URL=http://localhost:5000
npm run dev
```

Development Mode (No Azure Service Bus):
- When `AZURE_SERVICEBUS_CONNECTIONSTRING` is empty or not set:
  - The API will log messages locally instead of publishing to Azure
  - The Worker will process orders directly from the database
  - Orders will still transition through all states: Pendente → Processando → Finalizado
  - The system is fully functional for development and testing

Testing the Flow:
1. Create an order:
```bash
curl -X POST http://localhost:5000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "cliente": "João Silva",
    "produto": "Produto Teste",
    "valor": 99.90
  }'
```

2. Watch the Worker logs:
```bash
docker compose logs -f worker
```

3. Check order status:
```bash
curl http://localhost:5000/orders
```

Note: For production deployment, you'll need to configure Azure Service Bus.
