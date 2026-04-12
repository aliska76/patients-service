import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { CommonModule } from '@common/common.module';
import { PatientsModule } from '@modules/patients/patients.module';
import { HeartRateModule } from '@modules/heart-rate/heart-rate.module';
import { AnalyticsModule } from '@modules/analytics/analytics.module';

@Module({
  imports: [
    InfrastructureModule,
    CommonModule,
    PatientsModule,
    HeartRateModule,
    AnalyticsModule
  ]
})
export class AppModule { }