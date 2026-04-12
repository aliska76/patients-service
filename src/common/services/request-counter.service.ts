import { Injectable } from '@nestjs/common';

@Injectable()
export class RequestCounterService {
    private counter = new Map<string, number>();

    increment(id: string) {
        this.counter.set(id, (this.counter.get(id) || 0) + 1);
    }

    getCount(id: string) {
        return this.counter.get(id) || 0;
    }

    getAllCounts(): Map<string, number> {
        return new Map(this.counter);
    }

    reset(): void {
        this.counter.clear();
    }
}