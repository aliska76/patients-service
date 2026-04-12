import { Injectable } from '@nestjs/common';
import { HeartRateReading } from '@entity/heart-rate.type';

@Injectable()
export class HeartRateRepository {
    private readings: HeartRateReading[] = [];

    loadReadings(readings: HeartRateReading[]) {
        this.readings = readings;
    }

    findAll(): HeartRateReading[] {
        return this.readings;
    }

    findByPatientId(patientId: string): HeartRateReading[] {
        return this.readings.filter(reading => reading.patientId === patientId);
    }

    findByPatientIdAndDateRange(
        patientId: string,
        startDate?: Date,
        endDate?: Date
    ): HeartRateReading[] {
        let filtered = this.readings.filter(r => r.patientId === patientId);

        if (startDate) {
            filtered = filtered.filter(r => new Date(r.timestamp) >= startDate);
        }

        if (endDate) {
            filtered = filtered.filter(r => new Date(r.timestamp) <= endDate);
        }

        return filtered;
    }

    // This method looks for all readings with a pulse above the threshold.
    findHighHeartRates(threshold: number = 100): HeartRateReading[] {
        return this.readings.filter(reading => reading.heartRate > threshold);
    }

    // Pagination method for high heart rate
    findHighHeartRatesWithPagination(
        threshold: number,
        offset: number,
        limit: number
    ): { data: HeartRateReading[]; total: number } {
        const filtered = this.readings.filter(reading => reading.heartRate > threshold);
        const start = offset;
        const end = offset + limit;
        const data = filtered.slice(start, end);

        return {
            data,
            total: filtered.length
        };
    }
}