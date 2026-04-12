import { Controller, Get, Param, Query } from '@nestjs/common';
import { HeartRateService } from './heart-rate.service';
import { HighHeartRateEventDto } from '@dto/analytics.dto';
import { PaginationQueryDto, PaginatedResponseDto } from '@dto/pagination.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('heart-rate')
@Controller('heart-rate')
export class HeartRateController {
    constructor(private readonly heartRateService: HeartRateService) { }

    @Get('high-events')
    @ApiOperation({ summary: 'Get all heart rate events above 100 bpm with pagination' })
    @ApiQuery({ name: 'offset', required: false, description: 'Number of items to skip', example: 0 })
    @ApiQuery({ name: 'limit', required: false, description: 'Maximum number of items to return', example: 10 })
    @ApiResponse({
        status: 200,
        description: 'Returns paginated list of high heart rate events with patient information',
    })
    getHighHeartRates(@Query() pagination: PaginationQueryDto): PaginatedResponseDto<HighHeartRateEventDto> {
        // Преобразуем строки в числа
        const offset = typeof pagination.offset === 'string' ? parseInt(pagination.offset, 10) : (pagination.offset ?? 0);
        const limit = typeof pagination.limit === 'string' ? parseInt(pagination.limit, 10) : (pagination.limit ?? 10);

        return this.heartRateService.getHighHeartRatesWithPagination({ offset, limit });
    }

    @Get('patient/:patientId')
    @ApiOperation({ summary: 'Get all heart rate readings for a specific patient' })
    @ApiParam({ name: 'patientId', description: 'Patient ID', example: '1' })
    @ApiResponse({ status: 200, description: 'Returns all heart rate readings for the patient' })
    @ApiResponse({ status: 404, description: 'Patient not found' })
    getPatientReadings(@Param('patientId') patientId: string) {
        return this.heartRateService.getPatientReadings(patientId);
    }
}