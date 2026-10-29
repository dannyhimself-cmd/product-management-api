import { IsNotEmpty, IsPositive, IsString } from 'class-validator'

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsPositive()
    price: number;
}
