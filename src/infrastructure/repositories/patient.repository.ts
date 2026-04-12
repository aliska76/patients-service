import { Injectable } from '@nestjs/common';
import { Patient } from '@entity/patient.type';

@Injectable()
export class PatientRepository {
    private patients: Patient[] = [];

    loadPatients(patients: Patient[]) {
        this.patients = patients;
    }

    findAll(): Patient[] {
        return this.patients;
    }

    findWithPagination(offset: number, limit: number): { data: Patient[]; total: number } {
        const start = offset;
        const end = offset + limit;
        const data = this.patients.slice(start, end);

        return {
            data,
            total: this.patients.length
        };
    }

    findById(id: string): Patient | undefined {
        return this.patients.find(patient => patient.id === id);
    }

    existsById(id: string): boolean {
        return this.patients.some(patient => patient.id === id);
    }
}