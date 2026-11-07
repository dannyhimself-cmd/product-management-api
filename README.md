# Product Management API

A RESTful API for managing products, built with NestJS, TypeScript, TypeORM, and MySQL. This project focuses on backend development practices, including DTO validation, centralized exception handling, cursor-based pagination, and database migration management.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** MySQL
- **ORM:** TypeORM
- **Validation:** class-validator, class-transformer
- **API Documentation:** Swagger

## Features

- Product CRUD operations.
- DTO-based request validation.
- Centralized exception handling and standardized API responses.
- Cursor-based pagination with configurable sorting.
- Product search and price-range filtering.
- Database schema management using TypeORM migrations.
- Environment-based configuration.
- Interactive API documentation with Swagger.

## Project Structure

```text
src/
├── common/
│   ├── filters/
│   └── interceptors/
├── config/
├── database/
│   ├── migrations/
│   └── data-source.ts
├── products/
│   ├── dto/
│   ├── entities/
│   ├── products.controller.ts
│   ├── products.service.ts
│   └── products.module.ts
├── app.module.ts
└── main.ts
```

## Getting Started

### 1. Prerequisites

Make sure you have installed:

- Node.js
- npm
- MySQL

### 2. Clone the repository

```bash
git clone https://github.com/dannyhimself-cmd/product-management-api.git
cd product-management-api
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

The project supports separate environment configurations:

- `.env.development` for development.
- `.env.production` for production.

Use `.env.example` as a reference to create the corresponding environment file.

For local development, create `.env.development` in the project root and configure:

**Windows (PowerShell):**
```powershell
Copy-Item .env.example .env.development
```

**Linux/MacOS
```bash
cp .env.example .env.development
```

```env
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=product_management
PORT=3000
```

Then update the database credentials and other environment variables in .env.development to match your local configuration.

**Important:** Do not commit environment files containing actual credentials.

### 5. Create the database

Create the database specified by `DB_DATABASE` in your MySQL server before running migrations.

### 6. Run database migrations

For development:

```bash
npm run typeorm -- migration:run -d src/database/data-source.ts
```

To inspect migration status:

```bash
npm run typeorm -- migration:show -d src/database/data-source.ts
```

To revert the latest migration:

```bash
npm run typeorm -- migration:revert -d src/database/data-source.ts
```

The TypeORM data source loads the environment file based on `NODE_ENV`. Set `NODE_ENV=development` or `NODE_ENV=production` before executing migration commands.

For powershell
```powershell
$env:NODE_ENV="development"
```
Then follow the instructions above 

**Note:** `.env.example` is a template file and is not loaded automatically by the application. The command above creates `.env.development`, which matches the current `envFilePath` configuration.

### 7. Start the application

Development mode:

```bash
npm run start:dev
```

The application runs at:

```text 
http://localhost:3000
```

## Production Build

To build and run the application in production mode:

1. Create `.env.production` in the project root using `.env.example` as a reference.
2. Configure the production database credentials and environment variables.
3. Build the application:

```bash
npm run build
```

4. Start the application
```bash
npm run start:prod
```
The application will run using the production configuration defined in .env.production.

**Notes:**
- `npm run build` compiles TypeScript source files into JavaScript in the `dist` directory.
- `npm run start:prod` starts the application using the compiled files without watch mode.
- Make sure `NODE_ENV` is set to `production` before starting the application so it loads the `.env.production` configuration file.

For Windows PowerShell:

```powershell
$env:NODE_ENV="production"
npm run build
npm run start:prod
```

## API Documentation

Swagger documentation is available at:

```text
http://localhost:3000/api/docs
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/products` | Create a product |
| GET | `/products` | Retrieve products |
| GET | `/products/:id` | Retrieve a product by ID |
| PATCH | `/products/:id` | Update a product |
| DELETE | `/products/:id` | Delete a product |

### Product Listing

The `GET /products` endpoint supports:

| Query Parameter | Description |
|---|---|
| `limit` | Number of records per page |
| `cursor` | Cursor for retrieving the next page |
| `search` | Search products by name |
| `minPrice` | Minimum product price |
| `maxPrice` | Maximum product price |
| `sortBy` | Sorting field: `id`, `name`, or `price` |
| `order` | Sorting direction: `ASC` or `DESC` |

Example:

```http
GET /products?limit=10&search=keyboard&minPrice=100&sortBy=price&order=DESC
```

The response includes product data and pagination metadata.

## Database Schema

### Products

| Column | Type | Description |
|---|---|---|
| `id` | INT | Primary key, auto-increment |
| `name` | VARCHAR(100) | Product name |
| `price` | DECIMAL(10,2) | Product price |

Database schema changes are managed through TypeORM migrations with automatic synchronization disabled.

## Error Handling

The application uses a global exception filter to provide consistent error responses.

Example:

```json
{
  "statusCode": 404,
  "message": "Product not found",
  "timestamp": "2026-01-01T10:00:00.000Z",
  "path": "/products/1"
}
```

## License

This project was developed for learning and portfolio purposes.