import { Module } from '@nestjs/common';
import { HeartRateController } from './heart-rate.controller';
import { HeartRateService } from './heart-rate.service';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { CommonModule } from '@common/common.module';

@Module({
    imports: [InfrastructureModule, CommonModule],
    controllers: [HeartRateController],
    providers: [HeartRateService],
    exports: [HeartRateService]
})
export class HeartRateModule { }