import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { RequestCounterService } from '../services/request-counter.service';

@Injectable()
export class RequestInterceptor implements NestInterceptor {
    constructor(private readonly counter: RequestCounterService) { }

    intercept(context: ExecutionContext, next: CallHandler) {
        const request = context.switchToHttp().getRequest();
        const patientId = request.params.id;

        if (patientId && !request.url.includes('request-count')) {
            this.counter.increment(patientId);
        }

        return next.handle();
    }
}