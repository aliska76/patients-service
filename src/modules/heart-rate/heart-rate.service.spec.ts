import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { HeartRateService } from './heart-rate.service';
import { HeartRateRepository } from '../../infrastructure/repositories/heart-rate.repository';
import { PatientRepository } from '../../infrastructure/repositories/patient.repository';

describe('HeartRateService', () => {
    let service: HeartRateService;
    let heartRateRepo: HeartRateRepository;
    let patientRepo: PatientRepository;

    const mockPatients = [
        { id: '1', name: 'Alice Johnson', age: 34, gender: 'female' },
        { id: '2', name: 'Bob Smith', age: 45, gender: 'male' }
    ];

    const mockReadings = [
        { patientId: '1', timestamp: '2024-03-01T08:00:00Z', heartRate: 85 },
        { patientId: '1', timestamp: '2024-03-01T10:30:00Z', heartRate: 101 },
        { patientId: '1', timestamp: '2024-03-01T13:45:00Z', heartRate: 97 },
        { patientId: '2', timestamp: '2024-03-02T09:15:00Z', heartRate: 88 },
        { patientId: '2', timestamp: '2024-03-02T11:00:00Z', heartRate: 105 },
        { patientId: '2', timestamp: '2024-03-02T14:20:00Z', heartRate: 93 }
    ];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                HeartRateService,
                {
                    provide: HeartRateRepository,
                    useValue: {
                        findHighHeartRates: jest.fn(),
                        findByPatientId: jest.fn()
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

        service = module.get<HeartRateService>(HeartRateService);
        heartRateRepo = module.get<HeartRateRepository>(HeartRateRepository);
        patientRepo = module.get<PatientRepository>(PatientRepository);
    });

    describe('getHighHeartRates', () => {
        describe('when there are readings with heart rate above 100', () => {
            it('should return all high heart rate events with patient names', () => {
                const highReadings = mockReadings.filter(r => r.heartRate > 100);
                jest.spyOn(heartRateRepo, 'findHighHeartRates').mockReturnValue(highReadings);
                jest.spyOn(patientRepo, 'findById')
                    .mockReturnValueOnce(mockPatients[0])
                    .mockReturnValueOnce(mockPatients[1]);

                const result = service.getHighHeartRates();

                expect(result).toHaveLength(2);
                expect(result[0]).toEqual({
                    patientId: '1',
                    patientName: 'Alice Johnson',
                    timestamp: '2024-03-01T10:30:00Z',
                    heartRate: 101
                });
                expect(result[1]).toEqual({
                    patientId: '2',
                    patientName: 'Bob Smith',
                    timestamp: '2024-03-02T11:00:00Z',
                    heartRate: 105
                });
            });
        });

        describe('when a reading has heart rate above 100 but patient not found', () => {
            it('should use "Unknown" as patient name', () => {
                const highReadings = [{ patientId: '999', timestamp: '2024-03-01T10:30:00Z', heartRate: 101 }];
                jest.spyOn(heartRateRepo, 'findHighHeartRates').mockReturnValue(highReadings);
                jest.spyOn(patientRepo, 'findById').mockReturnValue(undefined);

                const result = service.getHighHeartRates();

                expect(result[0].patientName).toBe('Unknown');
            });
        });

        describe('when there are no readings with heart rate above 100', () => {
            it('should return an empty array', () => {
                jest.spyOn(heartRateRepo, 'findHighHeartRates').mockReturnValue([]);

                const result = service.getHighHeartRates();

                expect(result).toEqual([]);
            });
        });
    });

    describe('getPatientReadings', () => {
        describe('when patient exists', () => {
            it('should return all heart rate readings for that patient', () => {
                const patientReadings = mockReadings.filter(r => r.patientId === '1');
                jest.spyOn(patientRepo, 'findById').mockReturnValue(mockPatients[0]);
                jest.spyOn(heartRateRepo, 'findByPatientId').mockReturnValue(patientReadings);

                const result = service.getPatientReadings('1');

                expect(result).toHaveLength(3);
                expect(result).toEqual(patientReadings);
                expect(heartRateRepo.findByPatientId).toHaveBeenCalledWith('1');
            });
        });

        describe('when patient does not exist', () => {
            it('should throw NotFoundException', () => {
                jest.spyOn(patientRepo, 'findById').mockReturnValue(undefined);

                expect(() => service.getPatientReadings('999')).toThrow(NotFoundException);
                expect(heartRateRepo.findByPatientId).not.toHaveBeenCalled();
            });
        });
    });
});