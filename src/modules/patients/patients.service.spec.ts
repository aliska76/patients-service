import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientRepository } from '@infrastructure/repositories/patient.repository';
import { RequestCounterService } from '@common/services/request-counter.service';

describe('PatientsService', () => {
    let service: PatientsService;
    let patientRepo: PatientRepository;
    let requestCounter: RequestCounterService;

    const mockPatients = [
        { id: '1', name: 'Alice Johnson', age: 34, gender: 'female' },
        { id: '2', name: 'Bob Smith', age: 45, gender: 'male' }
    ];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PatientsService,
                {
                    provide: PatientRepository,
                    useValue: {
                        findAll: jest.fn(),
                        findById: jest.fn()
                    }
                },
                {
                    provide: RequestCounterService,
                    useValue: {
                        getCount: jest.fn()
                    }
                }
            ]
        }).compile();

        service = module.get<PatientsService>(PatientsService);
        patientRepo = module.get<PatientRepository>(PatientRepository);
        requestCounter = module.get<RequestCounterService>(RequestCounterService);
    });

    describe('findAll', () => {
        it('should return all patients when repository returns data', () => {
            jest.spyOn(patientRepo, 'findAll').mockReturnValue(mockPatients);

            const result = service.findAll();

            expect(result).toEqual(mockPatients);
            expect(patientRepo.findAll).toHaveBeenCalled();
        });

        it('should return empty array when no patients exist', () => {
            jest.spyOn(patientRepo, 'findAll').mockReturnValue([]);

            const result = service.findAll();

            expect(result).toEqual([]);
            expect(patientRepo.findAll).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should return patient when patient with given id exists', () => {
            jest.spyOn(patientRepo, 'findById').mockReturnValue(mockPatients[0]);

            const result = service.findOne('1');

            expect(result).toEqual(mockPatients[0]);
            expect(patientRepo.findById).toHaveBeenCalledWith('1');
        });

        it('should throw NotFoundException when patient with given id does not exist', () => {
            jest.spyOn(patientRepo, 'findById').mockReturnValue(undefined);

            expect(() => service.findOne('999')).toThrow(NotFoundException);
            expect(patientRepo.findById).toHaveBeenCalledWith('999');
        });
    });

    describe('getRequestCount', () => {
        it('should return request count when patient exists', () => {
            jest.spyOn(patientRepo, 'findById').mockReturnValue(mockPatients[0]);
            jest.spyOn(requestCounter, 'getCount').mockReturnValue(5);

            const result = service.getRequestCount('1');

            expect(result).toEqual({
                patientId: '1',
                requestCount: 5
            });
            expect(patientRepo.findById).toHaveBeenCalledWith('1');
            expect(requestCounter.getCount).toHaveBeenCalledWith('1');
        });

        it('should throw NotFoundException when patient does not exist', () => {
            jest.spyOn(patientRepo, 'findById').mockReturnValue(undefined);

            expect(() => service.getRequestCount('999')).toThrow(NotFoundException);
            expect(patientRepo.findById).toHaveBeenCalledWith('999');
            expect(requestCounter.getCount).not.toHaveBeenCalled();
        });
    });
});