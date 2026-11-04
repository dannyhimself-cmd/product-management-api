import { ApiProperty } from "@nestjs/swagger";

export class ErrorResponseDto {
    @ApiProperty({
        description: 'Http status code',
        type: Number,
        enum: [400,404,500],
        example: 400
    })
    statusCode: number;

    @ApiProperty({
        description: 'Error message',
        oneOf: [
            { type: 'string' },
            {
                type: 'array',
                items: { type: 'string' }
            }
        ]
    })
    message: string | string[];

    @ApiProperty({
        description: 'Time occurred',
        type: String,
        format: 'date-time',
        example: '2026-11-04T10:00:00.000Z'
    })
    timestamp: string;

    @ApiProperty({
        description: 'Endpoint of error',
        type: String,
        example: 'products?sortBy=email'
    })
    path: string;
}