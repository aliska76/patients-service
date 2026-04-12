export interface HeartRateReading {
    patientId: string;
    timestamp: string; // ISO string
    heartRate: number;
}