import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationQueryDto {
    @ApiProperty({
        required: false,
        description: 'Number of items to skip',
        example: 0,
        default: 0
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    offset: number = 0;

    @ApiProperty({
        required: false,
        description: 'Maximum number of items to return',
        example: 10,
        default: 10
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit: number = 10;
}

export class PaginatedResponseDto<T> {
    data: T[];
    total: number;
    offset: number;
    limit: number;
    hasMore: boolean;
}