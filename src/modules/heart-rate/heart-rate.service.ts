import { Injectable, NotFoundException } from '@nestjs/common';
import { HeartRateRepository } from '@infrastructure/repositories/heart-rate.repository';
import { PatientRepository } from '@infrastructure/repositories/patient.repository';
import { HighHeartRateEventDto } from '@dto/analytics.dto';
import { PaginationQueryDto, PaginatedResponseDto } from '@dto/pagination.dto';

@Injectable()
export class HeartRateService {
    constructor(
        private readonly heartRateRepo: HeartRateRepository,
        private readonly patientRepo: PatientRepository,
    ) { }

    getHighHeartRates(): HighHeartRateEventDto[] {
        const highReadings = this.heartRateRepo.findHighHeartRates(100);

        return highReadings.map(reading => {
            const patient = this.patientRepo.findById(reading.patientId);
            return {
                patientId: reading.patientId,
                patientName: patient?.name || 'Unknown',
                timestamp: reading.timestamp,
                heartRate: reading.heartRate,
            };
        });
    }

    getHighHeartRatesWithPagination(pagination: PaginationQueryDto): PaginatedResponseDto<HighHeartRateEventDto> {
        const offset = pagination.offset ?? 0;
        const limit = pagination.limit ?? 10;

        const { data, total } = this.heartRateRepo.findHighHeartRatesWithPagination(100, offset, limit);

        const events = data.map(reading => {
            const patient = this.patientRepo.findById(reading.patientId);
            return {
                patientId: reading.patientId,
                patientName: patient?.name || 'Unknown',
                timestamp: reading.timestamp,
                heartRate: reading.heartRate,
            };
        });

        return {
            data: events,
            total,
            offset,
            limit,
            hasMore: offset + limit < total,
        };
    }

    getPatientReadings(patientId: string) {
        const patient = this.patientRepo.findById(patientId);
        if (!patient) {
            throw new NotFoundException(`Patient with id ${patientId} not found`);
        }

        return this.heartRateRepo.findByPatientId(patientId);
    }
}