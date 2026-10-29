import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ProductsModule } from './products/products.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import 'dotenv/config'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: process.env.DB_PASSWORD,
      database: 'product_management',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ProductsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
