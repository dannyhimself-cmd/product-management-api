import { ApiProperty } from "@nestjs/swagger";

export class ProductResponseDto  {
    @ApiProperty({
        description: 'Product ID',
        example:1
    })
    id: number;

    @ApiProperty({
        description: 'Product name',
        example: 'Phone'
    })
    name: string;

    @ApiProperty({
        description: 'Product price',
        example:'15000'
    })
    price: string;
}