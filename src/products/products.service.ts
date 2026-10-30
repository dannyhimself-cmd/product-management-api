import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity.js';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from './dto/pagination-query.dto.js';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  create(dto: CreateProductDto) {
    const product = this.productRepository.create(dto);
    return this.productRepository.save(product);
  }

  async findAll(query: PaginationQueryDto) {
    const { page, limit, search, minPrice, maxPrice } = query;
    const skip = (page-1) * limit;
    const queryBuilder = this.productRepository.createQueryBuilder('products');

    if(search?.trim()) {
      queryBuilder.where('products.name LIKE :search', {
        search: `%${search.trim()}%`,
      });
    }
    if(minPrice != undefined) {
      queryBuilder.andWhere('products.price >= :minPrice', {
        minPrice,
      });
    }
    if(maxPrice != undefined) {
      queryBuilder.andWhere('products.price <= :maxPrice', {
        maxPrice,
      });
    }
    const [data, total] = 
    await queryBuilder
    .skip(skip)
    .take(limit)
    .orderBy('products.id')
    .getManyAndCount()

    return {
      data, 
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total/limit),
      },
    };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOneBy({
      id,
    });

    if (!product){
      throw new NotFoundException(
        `Product ${id} not found!`,
      );
    }
    return product;
  }

  async update(id: number, dto: UpdateProductDto) {
    const product = await this.findOne(id);
    Object.assign(product, dto);

    return this.productRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }
}
