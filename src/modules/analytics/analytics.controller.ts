import { Controller, Get, Param, Query, BadRequestException } from "@nestjs/common";
import { AnalyticsService } from "./analytics.service";
import { AnalyticsResponseDto } from "@dto/analytics.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
    constructor(private readonly service: AnalyticsService) { }

    private isValidDate(dateString: string): boolean {
        const date = new Date(dateString);
        return !isNaN(date.getTime());
    }

    @Get(':patientId')
    @ApiOperation({ summary: 'Get heart rate analytics for a patient' })
    @ApiParam({ name: 'patientId', description: 'Patient ID', example: '1' })
    @ApiQuery({ name: 'from', description: 'Start date (ISO format)', example: '2024-03-01T00:00:00Z' })
    @ApiQuery({ name: 'to', description: 'End date (ISO format)', example: '2024-03-01T23:59:59Z' })
    @ApiResponse({ status: 200, description: 'Returns analytics data', type: AnalyticsResponseDto })
    @ApiResponse({ status: 404, description: 'Patient not found' })
    @ApiResponse({ status: 400, description: 'Invalid date format or date range' })
    getAnalytics(
        @Param('patientId') patientId: string,
        @Query('from') from: string,
        @Query('to') to: string
    ): AnalyticsResponseDto {
        // Date validation
        if (!this.isValidDate(from)) {
            throw new BadRequestException(`Invalid from date: ${from}`);
        }

        if (!this.isValidDate(to)) {
            throw new BadRequestException(`Invalid to date: ${to}`);
        }

        return this.service.getStats(patientId, from, to);
    }
}