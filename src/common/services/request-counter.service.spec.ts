import { Test, TestingModule } from '@nestjs/testing';
import { RequestCounterService } from './request-counter.service';

describe('RequestCounterService', () => {
    let service: RequestCounterService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RequestCounterService],
        }).compile();

        service = module.get<RequestCounterService>(RequestCounterService);
        service.reset();
    });

    describe('increment', () => {
        it('should increase counter from 0 to 1 when incrementing new patient', () => {
            service.increment('1');

            expect(service.getCount('1')).toBe(1);
        });

        it('should increase counter by 1 each time when incrementing existing patient multiple times', () => {
            service.increment('1');
            service.increment('1');
            service.increment('1');

            expect(service.getCount('1')).toBe(3);
        });

        it('should maintain separate counters for different patients', () => {
            service.increment('1');
            service.increment('2');
            service.increment('1');

            expect(service.getCount('1')).toBe(2);
            expect(service.getCount('2')).toBe(1);
        });
    });

    describe('getCount', () => {
        it('should return 0 when patient has never been requested', () => {
            const result = service.getCount('999');

            expect(result).toBe(0);
        });

        it('should return correct count when patient has been requested multiple times', () => {
            service.increment('1');
            service.increment('1');
            service.increment('1');

            const result = service.getCount('1');

            expect(result).toBe(3);
        });
    });

    describe('getAllCounts', () => {
        it('should return map with all patient counts', () => {
            service.increment('1');
            service.increment('2');
            service.increment('1');

            const result = service.getAllCounts();

            expect(result.get('1')).toBe(2);
            expect(result.get('2')).toBe(1);
        });

        it('should return empty map when no counts exist', () => {
            const result = service.getAllCounts();

            expect(result.size).toBe(0);
        });
    });

    describe('reset', () => {
        it('should clear all counters when reset is called', () => {
            service.increment('1');
            service.increment('2');
            service.reset();

            expect(service.getCount('1')).toBe(0);
            expect(service.getCount('2')).toBe(0);
        });

        it('should allow new counts after reset', () => {
            service.increment('1');
            service.reset();
            service.increment('1');

            expect(service.getCount('1')).toBe(1);
        });
    });
});