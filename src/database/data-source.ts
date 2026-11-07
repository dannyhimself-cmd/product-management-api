import { DataSource } from "typeorm";
import { Product } from "../products/entities/product.entity.js";
import { getDatabaseOptions } from "../config/database-options.js";
import dotenv from 'dotenv';

dotenv.config({
    path: `.env.${process.env.NODE_ENV || 'development'}`,
});

const dbConfig = getDatabaseOptions()

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,

    entities: [Product],
    migrations: ['src/database/migrations/*.ts'],

    synchronize: false,
});