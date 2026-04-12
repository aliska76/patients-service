import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PatientRepository } from '../repositories/patient.repository';
import { HeartRateRepository } from '../repositories/heart-rate.repository';
import { getErrorMessage } from '@common/utils/error.utils';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SeedService implements OnModuleInit {
    private readonly logger = new Logger(SeedService.name);

    constructor(
        private patientRepository: PatientRepository,
        private heartRateRepository: HeartRateRepository
    ) { }

    async onModuleInit() {
        await this.loadData();
    }

    private async loadData() {
        try {
            const filePath = path.join(process.cwd(), 'patients.json');
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const data = JSON.parse(fileContent);

            if (data.patients && data.heartRateReadings) {
                this.patientRepository.loadPatients(data.patients);
                this.heartRateRepository.loadReadings(data.heartRateReadings);

                this.logger.log(`Loaded ${data.patients.length} patients`);
                this.logger.log(`Loaded ${data.heartRateReadings.length} heart rate readings`);
            } else {
                this.logger.warn('Invalid JSON structure: missing patients or heartRateReadings');
            }
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            this.logger.error(`Failed to load seed data: ${errorMessage}`);
        }
    }
}