import { DataSource } from "typeorm";
import 'dotenv/config'
import { Product } from "../products/entities/product.entity.js";

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: process.env.DB_PASSWORD,
    database: 'product_management',

    entities: [Product],
    migrations: ['src/database/migrations/*.ts'],

    synchronize: false,
});