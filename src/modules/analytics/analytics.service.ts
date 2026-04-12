import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { HeartRateRepository } from "@infrastructure/repositories/heart-rate.repository";
import { PatientRepository } from "@infrastructure/repositories/patient.repository";
import { AnalyticsResponseDto } from "@dto/analytics.dto";

@Injectable()
export class AnalyticsService {
    constructor(
        private readonly heartRateRepo: HeartRateRepository,
        private readonly patientRepo: PatientRepository
    ) { }

    private isValidDate(dateString: string): boolean {
        const date = new Date(dateString);
        return !isNaN(date.getTime());
    }

    getStats(patientId: string, from: string, to: string): AnalyticsResponseDto {
        const patient = this.patientRepo.findById(patientId);
        if (!patient) {
            throw new NotFoundException(`Patient with id ${patientId} not found`);
        }

        // Format date validation
        if (!this.isValidDate(from)) {
            throw new BadRequestException(`Invalid from date: ${from}`);
        }

        if (!this.isValidDate(to)) {
            throw new BadRequestException(`Invalid to date: ${to}`);
        }

        const fromDate = new Date(from);
        const toDate = new Date(to);

        if (fromDate > toDate) {
            throw new BadRequestException('startDate cannot be after endDate');
        }

        const readings = this.heartRateRepo.findAll().filter(r =>
            r.patientId === patientId &&
            new Date(r.timestamp) >= fromDate &&
            new Date(r.timestamp) <= toDate
        );

        const values = readings.map(r => r.heartRate);

        if (values.length === 0) {
            return {
                patientId, 
                patientName: patient.name,
                startDate: from,
                endDate: to,
                average: 0,
                min: 0,
                max: 0,
                readingsCount: 0
            };
        }

        const average = values.reduce((a, b) => a + b, 0) / values.length;

        return {
            patientId,
            patientName: patient.name,
            startDate: from,
            endDate: to,
            average: Number(average.toFixed(2)),
            min: Math.min(...values),
            max: Math.max(...values),
            readingsCount: readings.length
        };
    }
}