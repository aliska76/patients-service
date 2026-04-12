import { Module, Global } from '@nestjs/common';
import { RequestCounterService } from './services/request-counter.service';

@Global()
@Module({
    providers: [RequestCounterService],
    exports: [RequestCounterService]
})
export class CommonModule { }