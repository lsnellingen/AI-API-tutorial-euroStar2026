# E-Commerce REST API

A lightweight e-commerce REST API built with JavaScript and Express. Users can register, log in to receive a JWT token, and perform authenticated checkouts with cash or credit card payment methods. All data is stored in memory — no database required.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/lsnellingen/AI-API-tutorial-euroStar2026.git
cd AI-API-tutorial-euroStar2026
```

2. Install dependencies:

```bash
npm install
```

## How to Run

Start the server:

```bash
npm start
```

The API will be available at `http://localhost:3000`.

For development with auto-restart on file changes:

```bash
npm run dev
```

## Rules

- **Authentication required for checkout** — Only logged-in users with a valid JWT token can perform checkout.
- **Payment methods** — Checkout accepts only `cash` or `credit_card`.
- **Cash discount** — Paying with cash applies a 10% discount on the order subtotal.
- **In-memory storage** — Users and products are stored in memory. Data resets when the server restarts.

## Existent Data

### Users (password for all: `password123`)

| ID | Username | Email              |
|----|----------|--------------------|
| 1  | alice    | alice@example.com  |
| 2  | bob      | bob@example.com    |
| 3  | carol    | carol@example.com  |

### Products

| ID | Name                 | Price   | Stock |
|----|----------------------|---------|-------|
| 1  | Wireless Headphones  | $149.99 | 50    |
| 2  | Mechanical Keyboard  | $89.99  | 30    |
| 3  | USB-C Hub            | $49.99  | 100   |

## How to Use the REST API

Base URL: `http://localhost:3000/api`

### 1. Healthcheck

Check if the API is running.

```
GET /api/healthcheck
```

**Response (200):**

```json
{
  "status": "ok",
  "timestamp": "2026-06-15T10:00:00.000Z"
}
```

### 2. Register

Create a new user account and receive a JWT token.

```
POST /api/register
Content-Type: application/json
```

**Request body:**

```json
{
  "username": "dave",
  "email": "dave@example.com",
  "password": "mypassword"
}
```

**Response (201):**

```json
{
  "user": {
    "id": 4,
    "username": "dave",
    "email": "dave@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Login

Authenticate an existing user and receive a JWT token.

```
POST /api/login
Content-Type: application/json
```

**Request body:**

```json
{
  "username": "alice",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "user": {
    "id": 1,
    "username": "alice",
    "email": "alice@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 4. Checkout

Place an order for one or more products. Requires authentication.

```
POST /api/checkout
Content-Type: application/json
Authorization: Bearer <your-jwt-token>
```

**Request body:**

```json
{
  "items": [
    { "productId": 1, "quantity": 1 },
    { "productId": 3, "quantity": 2 }
  ],
  "paymentMethod": "cash"
}
```

**Response (201) — cash payment with 10% discount:**

```json
{
  "orderId": 1718445600000,
  "userId": 1,
  "items": [
    {
      "productId": 1,
      "name": "Wireless Headphones",
      "unitPrice": 149.99,
      "quantity": 1,
      "lineTotal": 149.99
    },
    {
      "productId": 3,
      "name": "USB-C Hub",
      "unitPrice": 49.99,
      "quantity": 2,
      "lineTotal": 99.98
    }
  ],
  "paymentMethod": "cash",
  "subtotal": 249.97,
  "discount": 25,
  "discountRate": 0.1,
  "total": 224.97
}
```

**Example with credit card (no discount):**

```json
{
  "items": [
    { "productId": 2, "quantity": 1 }
  ],
  "paymentMethod": "credit_card"
}
```

### Error Responses

| Status | Scenario                                      |
|--------|-----------------------------------------------|
| 400    | Invalid request body or payment method        |
| 401    | Missing, invalid, or expired JWT token        |
| 404    | Product not found                             |

## Project Structure

```
src/
├── app.js                  # Application entry point
├── controllers/            # Request handlers
├── middleware/             # Authentication middleware
├── models/                 # In-memory data stores
├── routes/                 # Route definitions
└── services/               # Business logic
```
