import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { HeartRateRepository } from '@infrastructure/repositories/heart-rate.repository';
import { PatientRepository } from '@infrastructure/repositories/patient.repository';

describe('AnalyticsService', () => {
    let service: AnalyticsService;
    let heartRateRepo: HeartRateRepository;
    let patientRepo: PatientRepository;

    const mockPatient = { id: '1', name: 'Alice Johnson', age: 34, gender: 'female' };

    const mockReadings = [
        { patientId: '1', timestamp: '2024-03-01T08:00:00Z', heartRate: 85 },
        { patientId: '1', timestamp: '2024-03-01T10:30:00Z', heartRate: 101 },
        { patientId: '1', timestamp: '2024-03-01T13:45:00Z', heartRate: 97 },
        { patientId: '1', timestamp: '2024-03-02T09:00:00Z', heartRate: 90 }
    ];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AnalyticsService,
                {
                    provide: HeartRateRepository,
                    useValue: {
                        findAll: jest.fn()
                    }
                },
                {
                    provide: PatientRepository,
                    useValue: {
                        findById: jest.fn()
                    }
                }
            ]
        }).compile();

        service = module.get<AnalyticsService>(AnalyticsService);
        heartRateRepo = module.get<HeartRateRepository>(HeartRateRepository);
        patientRepo = module.get<PatientRepository>(PatientRepository);
    });

    describe('getStats', () => {
        it('should return correct average, min, max when readings exist in date range', () => {
            jest.spyOn(patientRepo, 'findById').mockReturnValue(mockPatient);
            jest.spyOn(heartRateRepo, 'findAll').mockReturnValue(mockReadings);

            const result = service.getStats(
                '1',
                '2024-03-01T00:00:00Z',
                '2024-03-01T23:59:59Z'
            );

            expect(result).toEqual({
                patientId: '1',
                patientName: 'Alice Johnson',
                startDate: '2024-03-01T00:00:00Z',
                endDate: '2024-03-01T23:59:59Z',
                average: 94.33,
                min: 85,
                max: 101,
                readingsCount: 3
            });
        });

        it('should throw NotFoundException when patient does not exist', () => {
            jest.spyOn(patientRepo, 'findById').mockReturnValue(undefined);

            expect(() => service.getStats('999', '2024-03-01T00:00:00Z', '2024-03-01T23:59:59Z'))
                .toThrow(NotFoundException);
        });

        it('should throw BadRequestException when from date is after to date', () => {
            jest.spyOn(patientRepo, 'findById').mockReturnValue(mockPatient);

            expect(() => service.getStats(
                '1',
                '2024-03-02T00:00:00Z',
                '2024-03-01T00:00:00Z'
            )).toThrow(BadRequestException);
        });

        it('should return zeros when no readings exist in date range', () => {
            jest.spyOn(patientRepo, 'findById').mockReturnValue(mockPatient);
            jest.spyOn(heartRateRepo, 'findAll').mockReturnValue([]);

            const result = service.getStats(
                '1',
                '2024-03-01T00:00:00Z',
                '2024-03-01T23:59:59Z'
            );

            expect(result.average).toBe(0);
            expect(result.min).toBe(0);
            expect(result.max).toBe(0);
            expect(result.readingsCount).toBe(0);
        });

        it('should filter readings by date range correctly', () => {
            jest.spyOn(patientRepo, 'findById').mockReturnValue(mockPatient);
            jest.spyOn(heartRateRepo, 'findAll').mockReturnValue(mockReadings);

            const result = service.getStats(
                '1',
                '2024-03-02T00:00:00Z',
                '2024-03-02T23:59:59Z'
            );

            expect(result.readingsCount).toBe(1);
            expect(result.average).toBe(90);
            expect(result.min).toBe(90);
            expect(result.max).toBe(90);
        });
    });
});