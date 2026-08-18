# Omni-Channel API Gateway — Final Local Development Configuration

## 1. Purpose

This Gateway is the single HTTP entry point for the Omni-Channel microservices platform.

It contains **no business logic and no MongoDB/Mongoose models**. It only performs cross-cutting concerns and routes requests to the correct downstream service.

### Local ports

| Component | Port |
|---|---:|
| API Gateway | 8080 |
| IAM | 3001 |
| Customer & Account | 3002 |
| Customer Engagement | 3003 |
| Platform / Health / Document | 3004 |
| Product Catalog & Inventory | 3005 |
| Billing & Payment | 3006 |
| New Connection & Sales | 3007 |
| Usage Management | 3008 |
| Product Ordering | 3009 |
| Reporting / Dashboard | 3010 |

## 2. Gateway routing table

Every path below also accepts all nested resources under that prefix.

| Gateway path | Downstream service | Port | TMF |
|---|---|---:|---|
| `/internal-api/iam/v1/auth/login` | IAM | 3001 | Auth |
| `/internal-api/iam/v1/auth/refresh` | IAM | 3001 | Auth |
| `/internal-api/iam/v1/*` | IAM | 3001 | Internal |
| `/tmf-api/customerManagement/v4/*` | Customer | 3002 | TMF629 |
| `/tmf-api/partyManagement/v4/*` | Customer | 3002 | TMF632 |
| `/tmf-api/accountManagement/v4/*` | Customer | 3002 | TMF666 |
| `/tmf-api/communicationManagement/v4/*` | Customer Engagement | 3003 | TMF681 |
| `/internal-api/platform/v1/health` | Platform | 3004 | Public health |
| `/internal-api/platform/v1/*` | Platform | 3004 | Internal |
| `/tmf-api/productCatalogManagement/v4/*` | Product Catalog | 3005 | TMF620 |
| `/tmf-api/productInventoryManagement/v4/*` | Product Inventory | 3005 | TMF637 |
| `/tmf-api/customerBillManagement/v4/*` | Billing | 3006 | TMF678 |
| `/tmf-api/paymentManagement/v4/*` | Billing | 3006 | TMF676 |
| `/internal-api/sales/v1/*` | New Connection & Sales | 3007 | Internal |
| `/tmf-api/usageManagement/v4/*` | Usage | 3008 | TMF635 |
| `/tmf-api/productOrderingManagement/v4/*` | Product Ordering | 3009 | TMF622 |
| `/internal-api/reporting/v1/*` | Reporting | 3010 | Internal |

The Gateway restores the original Gateway path before proxying. Therefore a downstream TMF service receives the same `/tmf-api/...` path that the client requested.

## 3. Authentication

Public:
- `POST /internal-api/iam/v1/auth/login`
- `POST /internal-api/iam/v1/auth/refresh`
- `GET /internal-api/platform/v1/health`
- `GET /health` (Gateway's own health endpoint)

All other Gateway routes require:

`Authorization: Bearer <accessToken>`

The Gateway verifies the JWT using `JWT_ACCESS_SECRET`.

After successful verification it creates trusted headers:
- `x-user-id`
- `x-user-roles`
- `x-user-scope`

Client-supplied versions of these headers are removed so they cannot be spoofed.

## 4. Important security correction

The original Gateway mounted all IAM and Platform routes before the authentication middleware. That would accidentally make protected IAM/Platform routes public.

This version splits:
- public IAM auth routes
- public Platform health
- protected IAM routes
- protected Platform routes

Only the intended public endpoints bypass JWT validation.

## 5. MongoDB

The Gateway does **not** connect to MongoDB.

Each microservice owns its own logical database. The recommended development setup is one MongoDB Atlas Free Cluster containing ten service databases.

Example:

`Ordering Service -> omni_ordering_db`

If Ordering needs Customer data:

`Ordering -> Customer API -> omni_customer_db`

Never:

`Ordering -> omni_customer_db`

## 6. Setup

### First time

```bash
npm install
```

Copy:

```text
.env.example
```

to:

```text
.env
```

Then configure `JWT_ACCESS_SECRET` to the same signing secret used by IAM and confirm all service URLs/ports.

### Run

Development:

```bash
npm run dev
```

Production-style local start:

```bash
npm start
```

The Gateway starts on:

`http://localhost:8080`

Gateway health:

`GET http://localhost:8080/health`

Platform health through Gateway:

`GET http://localhost:8080/internal-api/platform/v1/health`

## 7. Important limitation

The Gateway can route requests only when the corresponding downstream microservice is running.

Running:

```bash
npm run dev
```

starts the **Gateway only**. It cannot magically start ten separate repositories unless the team's service repositories are also launched or containerized.

For full-platform one-command startup, all 10 service repositories must be included in a shared Docker Compose/monorepo deployment configuration.

## 8. Testing order

1. Start IAM and confirm login works.
2. Start all other services.
3. Start Gateway on port 8080.
4. Login through Gateway.
5. Copy the returned access token.
6. Test protected TMF APIs with `Authorization: Bearer <token>`.
7. Verify each request reaches the expected service port.
8. Run CTK validation against the Gateway URL.

## 9. Example request flow

```text
Client / Postman / CTK
        |
        v
API Gateway :8080
        |
        +---- /tmf-api/customerManagement/v4/* ----> Customer :3002
        |
        +---- /tmf-api/productCatalogManagement/v4/* -> Product :3005
        |
        +---- /tmf-api/productOrderingManagement/v4/* -> Ordering :3009
        |
        +---- /tmf-api/usageManagement/v4/* ----------> Usage :3008
        |
        +---- /tmf-api/customerBillManagement/v4/* ---> Billing :3006
        |
        +---- /tmf-api/paymentManagement/v4/* --------> Billing :3006
        |
        +---- /tmf-api/communicationManagement/v4/* -> Engagement :3003
        |
        +---- /internal-api/sales/v1/* ---------------> Sales :3007
        |
        +---- /internal-api/reporting/v1/* -----------> Reporting :3010
        |
        +---- /internal-api/platform/v1/* ------------> Platform :3004
        |
        +---- /internal-api/iam/v1/* -----------------> IAM :3001
```

## 10. Team rule

**OWN DATA -> OWN DATABASE -> OWN SERVICE API**

If another service needs your data:

**Other Service -> Your API -> Your Database**

Do not let one service directly connect to another service's MongoDB database.
