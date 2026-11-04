import { ApiProperty } from "@nestjs/swagger";
import { PaginationMetaDto } from "./pagination-meta.dto.js";
import { ProductResponseDto } from "./product-response.dto.js";

export class ProductListResponseDto {
    @ApiProperty({
        description: 'List of products',
        isArray: true,
        type: ProductResponseDto
    })
    data: ProductResponseDto[];

    @ApiProperty({
        description:'Pagination metadata',
        type: PaginationMetaDto
    })
    meta: PaginationMetaDto;
}