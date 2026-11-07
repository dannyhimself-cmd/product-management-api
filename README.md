# Product Management API

A RESTful API for managing products, built with **NestJS**, **TypeScript**, **TypeORM**, and **MySQL**.

The project focuses on backend fundamentals, including REST API design, data validation, cursor-based pagination, database migrations, and centralized error handling.

## Tech Stack

- **Backend:** NestJS, TypeScript, Node.js
- **Database:** MySQL
- **ORM:** TypeORM
- **Validation:** class-validator, class-transformer
- **API Documentation:** Swagger / OpenAPI
- **Testing:** Vitest

## Features

- **Product CRUD:** Create, retrieve, update, and delete products.
- **Request Validation:** Validate request bodies and query parameters using DTOs.
- **Cursor-based Pagination:** Retrieve records using cursor-based pagination with a configurable page size.
- **Filtering:** Search products by name and filter by minimum and maximum prices.
- **Sorting:** Sort products by `id`, `name`, or `price` in ascending or descending order.
- **Centralized Error Handling:** Standardize error responses through a global exception filter.
- **Consistent Response Structure:** Wrap successful responses using a global response interceptor.
- **Database Migrations:** Manage database schema changes through TypeORM migrations.
- **API Documentation:** Explore and test endpoints through Swagger UI.

## Project Structure

```text
src/
├── common/
│   ├── filters/          # Global exception filter
│   ├── interceptor/      # Response interceptor
│   └── interfaces/
├── config/               # Application configuration
├── database/
│   ├── migrations/       # TypeORM migrations
│   └── data-source.ts    # TypeORM CLI data source
├── products/
│   ├── dto/              # Request and response DTOs
│   ├── entities/         # Product entity
│   ├── products.controller.ts
│   ├── products.service.ts
│   └── products.module.ts
├── app.module.ts
└── main.ts
```

## Getting Started

### Prerequisites

- Node.js
- npm
- MySQL

### 1. Clone the repository

```bash
git clone https://github.com/dannyhimself-cmd/product-management-api.git

cd product-management-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root based on `.env.example`.

```env
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=product_management

PORT=3000
```

Update the values according to your local MySQL configuration.

### 4. Create the database

Create the database specified by `DB_DATABASE` in MySQL before running the migrations.

```sql
CREATE DATABASE product_management;
```

### 5. Run database migrations

Apply pending migrations:

```bash
npm run typeorm -- migration:run -d src/database/data-source.ts
```

Check migration status:

```bash
npm run typeorm -- migration:show -d src/database/data-source.ts
```

Revert the latest migration:

```bash
npm run typeorm -- migration:revert -d src/database/data-source.ts
```

### 6. Start the application

Development mode:

```bash
npm run start:dev
```

The API will be available at:

```text
http://localhost:3000
```

## API Documentation

Swagger UI is available at:

```text
http://localhost:3000/api/docs
```

## API Endpoints

Base path: `/products`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/products` | Create a product |
| GET | `/products` | Retrieve products |
| GET | `/products/:id` | Retrieve a product by ID |
| PATCH | `/products/:id` | Update a product |
| DELETE | `/products/:id` | Delete a product |

### Create a product

**Request**

```http
POST /products
Content-Type: application/json
```

```json
{
  "name": "Laptop Dell",
  "price": 599.99
}
```

**Response: 201 Created**

```json
{
  "data": {
    "id": 1,
    "name": "Laptop Dell",
    "price": "599.99"
  }
}
```

### Retrieve products

The `GET /products` endpoint supports pagination, searching, filtering, and sorting.

**Query parameters**

| Parameter | Description | Default |
|---|---|---|
| `limit` | Number of products per page (1–100) | `10` |
| `cursor` | Cursor for retrieving the next page | None |
| `search` | Search products by name | None |
| `minPrice` | Minimum product price | None |
| `maxPrice` | Maximum product price | None |
| `sortBy` | Sort field: `id`, `name`, `price` | `id` |
| `order` | Sort direction: `ASC`, `DESC` | `ASC` |

**Example request**

```http
GET /products?limit=10&search=keyboard&minPrice=100&maxPrice=1000&sortBy=price&order=ASC
```

**Response: 200 OK**

```json
{
  "data": [
    {
      "id": 1,
      "name": "Mechanical Keyboard",
      "price": "299.99"
    }
  ],
  "meta": {
    "limit": 10,
    "total": 1,
    "hasNextPage": false,
    "nextCursor": null
  }
}
```

When `hasNextPage` is `true`, use the returned `nextCursor` to retrieve the next page.

```http
GET /products?limit=10&cursor=YOUR_NEXT_CURSOR
```

### Update a product

```http
PATCH /products/1
Content-Type: application/json
```

```json
{
  "price": 499.99
}
```

### Delete a product

```http
DELETE /products/1
```

Returns `204 No Content` when the product is successfully deleted.

## Error Response

The application uses a global exception filter to return a consistent error structure.

```json
{
  "statusCode": 400,
  "message": [
    "price must be a positive number"
  ],
  "timestamp": "2026-11-07T08:00:00.000Z",
  "path": "/products"
}
```

## Database Design

The project currently uses a `products` table.

| Column | Type | Description |
|---|---|---|
| `id` | INT | Primary key, auto-increment |
| `name` | VARCHAR(100) | Product name |
| `price` | DECIMAL(10,2) | Product price |

Database schema changes are managed through TypeORM migrations. Automatic schema synchronization is disabled.

## License

This project is currently a personal learning and portfolio project.