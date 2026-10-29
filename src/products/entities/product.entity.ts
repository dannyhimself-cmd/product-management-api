import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({length: 100})
    name!: string;

    @Column('decimal', {
        precision: 10,
        scale: 2
    })
    price!: number;
}
