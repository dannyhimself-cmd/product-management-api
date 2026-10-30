import { IsInt, IsNumber, IsOptional, IsString, Max, Min, Validate } from "class-validator";
import{ Type } from "class-transformer";
import { PriceRangeValidator } from "../price-range.validator.js";

export class PaginationQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit: number = 10;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    minPrice?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    @Validate(PriceRangeValidator)
    maxPrice?: number;
}