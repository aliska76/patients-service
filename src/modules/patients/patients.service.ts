import { RequestCounterService } from "@common/services/request-counter.service";
import { RequestCountResponseDto } from "@dto/analytics.dto";
import { PaginationQueryDto, PaginatedResponseDto } from "@dto/pagination.dto";
import { PatientRepository } from "@infrastructure/repositories/patient.repository";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Patient } from "@entity/patient.type";

@Injectable()
export class PatientsService {
    constructor(
        private readonly patientRepo: PatientRepository,
        private readonly requestCounter: RequestCounterService
    ) { }

    findAll(): Patient[] {
        return this.patientRepo.findAll();
    }

    findAllWithPagination(pagination: PaginationQueryDto): PaginatedResponseDto<Patient> {
        const offset = pagination.offset ?? 0;
        const limit = pagination.limit ?? 10;

        const { data, total } = this.patientRepo.findWithPagination(offset, limit);

        return {
            data,
            total,
            offset,
            limit,
            hasMore: offset + limit < total,
        };
    }

    findOne(id: string) {
        const patient = this.patientRepo.findById(id);
        if (!patient) {
            throw new NotFoundException(`Patient with id ${id} not found`);
        }
        return patient;
    }

    getRequestCount(id: string): RequestCountResponseDto {
        const patient = this.patientRepo.findById(id);
        if (!patient) {
            throw new NotFoundException(`Patient with id ${id} not found`);
        }

        return {
            patientId: id,
            requestCount: this.requestCounter.getCount(id)
        };
    }
}