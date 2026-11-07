import { ApiProperty } from "@nestjs/swagger";
import { ProductResponseDto } from "./product-response.dto.js";

export class ProductSingleResponseDto {
    @ApiProperty({
        description: 'Product data',
        type: ProductResponseDto
    })
    data: ProductResponseDto;
}