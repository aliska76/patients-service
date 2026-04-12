import { Controller, Get, Param, UseInterceptors, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { RequestCountResponseDto } from '@dto/analytics.dto';
import { PaginationQueryDto, PaginatedResponseDto } from '@dto/pagination.dto';
import { RequestInterceptor } from '@common/interceptors/request.interceptor';
import { Patient } from '@entity/patient.type';

@ApiTags('patients')
@Controller('patients')
@UseInterceptors(RequestInterceptor)
export class PatientsController {
    constructor(private readonly patientsService: PatientsService) { }

    @Get()
    @ApiOperation({ summary: 'Get all patients with pagination' })
    @ApiQuery({ name: 'offset', required: false, description: 'Number of items to skip', example: 0 })
    @ApiQuery({ name: 'limit', required: false, description: 'Maximum number of items to return', example: 10 })
    @ApiResponse({ status: 200, description: 'List of all patients with pagination metadata' })
    findAll(@Query() pagination: PaginationQueryDto): PaginatedResponseDto<Patient> {
        return this.patientsService.findAllWithPagination(pagination);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get patient by ID' })
    @ApiParam({ name: 'id', description: 'Patient ID' })
    @ApiResponse({ status: 200, description: 'Patient found' })
    @ApiResponse({ status: 404, description: 'Patient not found' })
    findById(@Param('id') id: string) {
        return this.patientsService.findOne(id);
    }

    @Get(':id/request-count')
    @ApiOperation({ summary: 'Get request count for patient' })
    @ApiParam({ name: 'id', description: 'Patient ID' })
    @ApiResponse({ status: 200, description: 'Request count retrieved', type: RequestCountResponseDto })
    @ApiResponse({ status: 404, description: 'Patient not found' })
    getRequestCount(@Param('id') id: string): RequestCountResponseDto {
        return this.patientsService.getRequestCount(id);
    }
}