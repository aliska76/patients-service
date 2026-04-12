import { IsOptional, IsDateString, IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AnalyticsQueryDto {
    @IsOptional()
    @IsDateString()
    @ApiProperty({ required: false, description: 'Start date (ISO format)' })
    startDate?: string;

    @IsOptional()
    @IsDateString()
    @ApiProperty({ required: false, description: 'End date (ISO format)' })
    endDate?: string;
}

export class AnalyticsResponseDto {
    @ApiProperty({
        example: '1',
        description: 'Patient ID'
    })
    @IsNotEmpty({ message: 'Patient ID is required' })
    @IsString({ message: 'Patient ID must be a string' })
    patientId: string;

    @ApiProperty({
        example: 'Alice Johnson',
        description: 'Patient full name'
    })
    @IsNotEmpty({ message: 'Patient name is required' })
    @IsString({ message: 'Patient name must be a string' })
    patientName: string;

    @ApiProperty({
        example: '2024-03-01T00:00:00Z',
        description: 'Start date of the analysis period'
    })
    @IsNotEmpty({ message: 'Start date is required' })
    @IsDateString({}, { message: 'Start date must be valid ISO date' })
    startDate: string;

    @ApiProperty({
        example: '2024-03-01T23:59:59Z',
        description: 'End date of the analysis period'
    })
    @IsNotEmpty({ message: 'End date is required' })
    @IsDateString({}, { message: 'End date must be valid ISO date' })
    endDate: string;

    @ApiProperty({
        example: 94.33,
        description: 'Average heart rate (bpm)'
    })
    @IsNumber({}, { message: 'Average must be a number' })
    average: number;

    @ApiProperty({
        example: 85,
        description: 'Minimum heart rate (bpm)'
    })
    @IsNumber({}, { message: 'Minimum must be a number' })
    min: number;

    @ApiProperty({
        example: 101,
        description: 'Maximum heart rate (bpm)'
    })
    @IsNumber({}, { message: 'Maximum must be a number' })
    max: number;

    @ApiProperty({
        example: 3,
        description: 'Number of readings in the period'
    })
    @IsNumber({}, { message: 'Readings count must be a number' })
    readingsCount: number;

    constructor(partial: Partial<AnalyticsResponseDto>) {
        Object.assign(this, partial);
    }
}

export class HighHeartRateEventDto {
    @ApiProperty({
        example: '1',
        description: 'Patient ID'
    })
    @IsNotEmpty({ message: 'Patient ID is required' })
    @IsString({ message: 'Patient ID must be a string' })
    patientId: string;

    @ApiProperty({
        example: 'Alice Johnson',
        description: 'Patient full name'
    })
    @IsNotEmpty({ message: 'Patient name is required' })
    @IsString({ message: 'Patient name must be a string' })
    patientName: string;

    @ApiProperty({
        example: '2024-03-01T10:30:00Z',
        description: 'Timestamp of the reading'
    })
    @IsNotEmpty({ message: 'Timestamp is required' })
    @IsDateString({}, { message: 'Timestamp must be valid ISO date' })
    timestamp: string;

    @ApiProperty({
        example: 101,
        description: 'Heart rate value (bpm)'
    })
    @IsNumber({}, { message: 'Heart rate must be a number' })
    heartRate: number;

    constructor(partial: Partial<HighHeartRateEventDto>) {
        Object.assign(this, partial);
    }
}

export class RequestCountResponseDto {
    @ApiProperty({
        example: '1',
        description: 'Patient ID'
    })
    @IsNotEmpty({ message: 'Patient ID is required' })
    @IsString({ message: 'Patient ID must be a string' })
    patientId: string;

    @ApiProperty({
        example: 5,
        description: 'Number of times patient data was requested'
    })
    @IsNumber({}, { message: 'Request count must be a number' })
    requestCount: number;

    constructor(partial: Partial<RequestCountResponseDto>) {
        Object.assign(this, partial);
    }
}