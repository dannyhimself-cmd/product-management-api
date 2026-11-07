    import { ApiProperty } from '@nestjs/swagger';
    import { Transform } from 'class-transformer';
    import { IsNotEmpty, IsNumber, IsPositive, IsString, Matches, MaxLength } from 'class-validator'

    export class CreateProductDto {
        @Transform(({ value }) =>
            typeof value === 'string'
                ? value.trim().replace(/\s+/g, ' ')
                : value
        )
        @ApiProperty({
            description:'Product name',
            example:'Laptop Dell',
        })
        @IsNotEmpty()
        @IsString()
        @Matches(/^\S+(?: \S+)*$/)
        @MaxLength(100)
        name: string;

        @ApiProperty({
            description: 'Product price',
            example: 59.99,
        })
        @IsNotEmpty()
        @IsPositive()
        @IsNumber()
        price: number;
    }
