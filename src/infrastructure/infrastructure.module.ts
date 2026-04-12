import { Module } from '@nestjs/common';
import { PatientRepository } from './repositories/patient.repository';
import { HeartRateRepository } from './repositories/heart-rate.repository';
import { SeedService } from './data/seed.service';

@Module({
    providers: [PatientRepository, HeartRateRepository, SeedService],
    exports: [PatientRepository, HeartRateRepository]
})
export class InfrastructureModule { }