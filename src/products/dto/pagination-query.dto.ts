import { IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, Validate } from "class-validator";
import{ Transform, Type } from "class-transformer";
import { PriceRangeValidator } from "../price-range.validator.js";
import { ApiPropertyOptional } from "@nestjs/swagger";

export type ProductSortBy = 'id' | 'name' | 'price';

export class PaginationQueryDto {
    @ApiPropertyOptional({
        description:'Number of products per page',
        example: 10,
        default: 10,
        minimum: 1,
        maximum: 100
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit: number = 10;

    @ApiPropertyOptional({
        description: 'Cursor used to retrieve the next page of products'
    })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    cursor?: string;

    @ApiPropertyOptional({
        description:'Name to search',
        example:'Keyboard'
    })
    @Transform(({ value }) =>
        typeof value === 'string'
            ? value.trim().replace(/\s+/g, ' ')
            : value
    )
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({
        description:'Filter the minimum price',
        example:200
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    minPrice?: number;

    @ApiPropertyOptional({
        description:'Filter the maximum price',
        example:10000
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    @Validate(PriceRangeValidator)
    maxPrice?: number;

    @ApiPropertyOptional({
        description:'Sort by something',
        example:'name',
        enum:['name', 'price', 'id'],
        default: 'id',
    })
    @IsOptional()
    @IsIn(['id', 'name', 'price'])
    sortBy: ProductSortBy = 'id';

    @ApiPropertyOptional({
        description:'Set the order for sorting',
        example:'ASC',
        enum:['ASC', 'DESC'],
        default:'ASC'
    })
    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    order: 'ASC' | 'DESC' = 'ASC';
}