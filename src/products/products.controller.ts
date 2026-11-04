import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, ParseIntPipe, Query} from '@nestjs/common';
import { ProductsService } from './products.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { PaginationQueryDto } from './dto/pagination-query.dto.js';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductListResponseDto } from './dto/product-list-response.dto.js';
import { ProductSingleResponseDto } from './dto/product-single-response.dto.js';
import { ErrorResponseDto } from './dto/error-response.dto.js';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiCreatedResponse({
    description: 'Item created',
    type: ProductSingleResponseDto
  })
  @ApiBadRequestResponse({
    description: 'Invalid data',
    type: ErrorResponseDto
  })
  @ApiInternalServerErrorResponse({
    description:'Internal server error',
    type: ErrorResponseDto
  })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiOkResponse({
    description: 'Products retreived successfully',
    type: ProductListResponseDto
  })
  @ApiBadRequestResponse({
    description: 'Invalid query parameters',
    type: ErrorResponseDto
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorResponseDto
  })
  findAll(@Query() query: PaginationQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a product by ID' })
  @ApiOkResponse({
    description: 'Product retrieved successfully',
    type: ProductSingleResponseDto
  })
  @ApiBadRequestResponse({
    description: 'Invalid parameters',
    type: ErrorResponseDto
  })
  @ApiNotFoundResponse({
    description: 'Not found',
    type: ErrorResponseDto
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorResponseDto
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update the specific products' })
  @ApiOkResponse({
    description: 'Item updated',
    type: ProductSingleResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid product Id or product data',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
    type: ErrorResponseDto
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorResponseDto
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove product by ID' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'Item removed'
  })
  @ApiBadRequestResponse({
    description: 'Invalid parameters',
    type: ErrorResponseDto
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
    type: ErrorResponseDto
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorResponseDto
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
