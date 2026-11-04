import { ApiProperty } from "@nestjs/swagger";

export class PaginationMetaDto {
    @ApiProperty({
        description: 'Max item per page',
        example:10,
        type: Number
    })
    limit: number;

    @ApiProperty({
        description: 'Total number of products',
        example: 20,
        type: Number
    })
    total: number;

    @ApiProperty({
        description: 'Indicates whether another page of products exists',    
        type: Boolean
    })
    hasNextPage: boolean;

    @ApiProperty({
        description: 'Cursor used to retrieve the next page of products',
        example: null,
        nullable: true,
        type: String
    })
    nextCursor: string | null;
}