import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity.js';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { PaginationQueryDto } from './dto/pagination-query.dto.js';
import type { ProductSortBy } from './dto/pagination-query.dto.js';

//Tạo interface ProductCursor với các thuộc tính sẽ được mã hoá
//value: tuỳ kiểu sortby: name là string và price sẽ là number
//id: thuộc tính phụ khi có 2 record trùng nhau về tiêu chí sortby, sẽ được hệ thống tự tính toán và thêm vào
//order: thứ tự sắp xếp
//Note: trang đầu tiên sẽ không có cursor, cursor được lấy khi có trang tiếp theo
interface ProductCursor {
  value: number | string;
  id: number;
  sortBy: ProductSortBy;
  order: 'ASC' | 'DESC';
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) { }

  create(dto: CreateProductDto) {
    const product = this.productRepository.create(dto);
    return this.productRepository.save(product);
  }

  private encodeCursor(data: ProductCursor): string {
    return Buffer.from(JSON.stringify(data)).toString('base64');
  }

  //Mã hoá cursor hợp lệ
  private decodeCursor(cursor: string): ProductCursor {
    try {
      const decoded = Buffer
        .from(cursor, 'base64')
        .toString('utf-8');

      const data: unknown = JSON.parse(decoded);
      //Tạo danh sách cho phép giá trị truyền vào để kiểm tra
      const allowedSortBy: ProductSortBy[] = ['id','name','price'];
      const allowedOrder = ['ASC', 'DESC']

      if (
        typeof data !== 'object' ||
        data === null ||
        !('value' in data) ||
        !('id' in data) ||
        !('sortBy' in data) ||
        !('order' in data)
      ) {
        throw new BadRequestException('Invalid cursor!');
      }

      if (
        typeof data.sortBy !== 'string' ||
        typeof data.order !== 'string' ||
        !allowedSortBy.includes(data.sortBy as ProductSortBy) ||
        !allowedOrder.includes(data.order) ||
        typeof data.value !== 'string' &&
        (
          typeof data.value !== 'number' ||
          !Number.isFinite(data.value)
        )
      ) {
        throw new BadRequestException('Invalid cursor!');
      }

      if (
        typeof data.id !== 'number' ||
        !Number.isInteger(data.id) ||
        data.id <= 0
      ) {
        throw new BadRequestException('Invalid cursor!');
      }

      return data as ProductCursor;

    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException('Invalid cursor!');
    }
  }

  //Hàm áp dụng truy vấn database cho các điều kiện sortBy và order
  private applyCursorCondition(
    queryBuilder: SelectQueryBuilder<Product>,
    cursor: ProductCursor,
    sortBy: ProductSortBy,
    order: 'ASC' | 'DESC',
  ): void {
    const operator = order === 'ASC' ? '>' : '<';
    const sortColumn: Record<ProductSortBy, string> = {
      id: 'products.id',
      name: 'products.name',
      price: 'products.price',
    };

    if (sortBy === 'id') {
      queryBuilder.andWhere(
        `products.id ${operator} :cursorId`,
        { cursorId: cursor.id },
      );
      return;
    }

    if (sortBy === 'name' && typeof cursor.value !== 'string') {
      throw new BadRequestException('Expected a string value for "name"');
    }

    if (
      sortBy === 'price' &&
      !(
        (typeof cursor.value === 'number' && Number.isFinite(cursor.value)) ||
        (typeof cursor.value === 'string' &&
          cursor.value.trim() !== '' &&
          Number.isFinite(Number(cursor.value)))
      )
    ) {
      throw new BadRequestException('Price value error!');
    }

    queryBuilder.andWhere(
      new Brackets((qb) => {
        qb.where(`${sortColumn[sortBy]} ${operator} :cursorValue`, {
          cursorValue: cursor.value,
        }).orWhere(
          `${sortColumn[sortBy]} = :cursorValue AND products.id > :cursorId`,
          {
            cursorValue: cursor.value,
            cursorId: cursor.id,
          },
        );
      }),
    );
  }

  async findAll(query: PaginationQueryDto) {
    const { cursor, limit, search, minPrice, maxPrice, sortBy, order } = query;
    const queryBuilder = this.productRepository.createQueryBuilder('products');
    const sortColumn: Record<ProductSortBy, string> = {
      id: 'products.id',
      name: 'products.name',
      price: 'products.price',
    };

    if (search?.trim()) {
      queryBuilder.andWhere('products.name LIKE :search', {
        search: `%${search.trim()}%`,
      });
    }
    if (minPrice !== undefined) {
      queryBuilder.andWhere('products.price >= :minPrice', {
        minPrice,
      });
    }
    if (maxPrice !== undefined) {
      queryBuilder.andWhere('products.price <= :maxPrice', {
        maxPrice,
      });
    }

    //Lấy key hợp lệ của trang nếu có
    //Kiểm tra value trả ra của cursor có khớp với url của query hay không
    const resultsQueryBuilder = queryBuilder.clone();
      if (cursor) {
        const result = this.decodeCursor(cursor);

        if (result.sortBy !== sortBy ||result.order !== order) {
          throw new BadRequestException('order or sortBy value does not match');
        }

        this.applyCursorCondition(
          resultsQueryBuilder,
          result,
          sortBy,
          order,
        );
    }
    const total = await queryBuilder.getCount();
    resultsQueryBuilder.orderBy(sortColumn[sortBy], order);

    if (sortBy !== 'id') {
      resultsQueryBuilder.addOrderBy('products.id', 'ASC');
    }

    const rows = await resultsQueryBuilder
      .take(limit + 1)
      .getMany();

    //Sinh key cho trang tiếp theo
    const hasNextPage = rows.length > limit;
    const data = rows.slice(0, limit);
    const lastProduct = data[data.length - 1];
    const nextCursor =
      hasNextPage && lastProduct
        ? this.encodeCursor({
            value: lastProduct[sortBy],
            id: lastProduct.id,
            sortBy,
            order,
          })
        : null;

    return {
      data,
      meta: {
        limit,
        total,
        hasNextPage,
        nextCursor,
      },
    };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOneBy({
      id,
    });

    if (!product) {
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
