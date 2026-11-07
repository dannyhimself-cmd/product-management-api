import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service.js';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity.js';

describe('ProductsService', () => {
  let service: ProductsService;

  const mockProductRepository = {
    find: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
    delete: vi.fn(),
    createQueryBuilder: vi.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
