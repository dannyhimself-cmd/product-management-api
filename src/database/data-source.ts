import { DataSource } from "typeorm";
import 'dotenv/config'
import { Product } from "../products/entities/product.entity.js";
import { getDatabaseOptions } from "../config/database-options.js";

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