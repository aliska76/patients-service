import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    
    app.useGlobalPipes(new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true }
    }));

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Patients', () => {
    it('GET /patients should return paginated patients', () => {
      return request(app.getHttpServer())
        .get('/patients')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('offset');
          expect(res.body).toHaveProperty('limit');
          expect(res.body).toHaveProperty('hasMore');
          expect(res.body.data).toHaveLength(2);
          expect(res.body.data[0]).toHaveProperty('name', 'Alice Johnson');
        });
    });

    it('GET /patients with pagination parameters should respect offset and limit', () => {
      return request(app.getHttpServer())
        .get('/patients?offset=0&limit=1')
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toHaveLength(1);
          expect(res.body.offset).toBe(0);
          expect(res.body.limit).toBe(1);
          expect(res.body.total).toBe(2);
          expect(res.body.hasMore).toBe(true);
        });
    });

    it('GET /patients/1 should return patient with id 1', () => {
      return request(app.getHttpServer())
        .get('/patients/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', '1');
          expect(res.body).toHaveProperty('name', 'Alice Johnson');
        });
    });

    it('GET /patients/999 should return 404', () => {
      return request(app.getHttpServer())
        .get('/patients/999')
        .expect(404);
    });

    it('GET /patients/1/request-count should return request count', () => {
      return request(app.getHttpServer())
        .get('/patients/1/request-count')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('patientId', '1');
          expect(res.body).toHaveProperty('requestCount');
        });
    });
  });

  describe('Heart Rate', () => {
    it('GET /heart-rate/high-events should return paginated events > 100 bpm', () => {
      return request(app.getHttpServer())
        .get('/heart-rate/high-events')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('offset');
          expect(res.body).toHaveProperty('limit');
          expect(res.body).toHaveProperty('hasMore');
          expect(res.body.data).toBeInstanceOf(Array);
          if (res.body.data.length > 0) {
            expect(res.body.data[0]).toHaveProperty('heartRate');
            expect(res.body.data[0].heartRate).toBeGreaterThan(100);
          }
        });
    });

    it('GET /heart-rate/high-events with pagination should respect offset and limit', () => {
      return request(app.getHttpServer())
        .get('/heart-rate/high-events?offset=0&limit=1')
        .expect(200)
        .expect((res) => {
          expect(res.body.offset).toBe(0);
          expect(res.body.limit).toBe(1);
        });
    });

    it('GET /heart-rate/patient/1 should return readings for patient 1', () => {
      return request(app.getHttpServer())
        .get('/heart-rate/patient/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(3);
        });
    });

    it('GET /heart-rate/patient/999 should return 404', () => {
      return request(app.getHttpServer())
        .get('/heart-rate/patient/999')
        .expect(404);
    });
  });

  describe('Analytics', () => {
    it('GET /analytics/1?from=2024-03-01T00:00:00Z&to=2024-03-01T23:59:59Z should return statistics', () => {
      return request(app.getHttpServer())
        .get('/analytics/1?from=2024-03-01T00:00:00Z&to=2024-03-01T23:59:59Z')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('patientId', '1');
          expect(res.body).toHaveProperty('average');
          expect(res.body).toHaveProperty('min');
          expect(res.body).toHaveProperty('max');
          expect(res.body).toHaveProperty('readingsCount');
        });
    });

    it('GET /analytics/1?from=2024-03-02T00:00:00Z&to=2024-03-01T00:00:00Z should return 400 when from > to', () => {
      return request(app.getHttpServer())
        .get('/analytics/1?from=2024-03-02T00:00:00Z&to=2024-03-01T00:00:00Z')
        .expect(400);
    });

    it('GET /analytics/999 should return 404 for non-existent patient', () => {
      return request(app.getHttpServer())
        .get('/analytics/999?from=2024-03-01T00:00:00Z&to=2024-03-01T23:59:59Z')
        .expect(404);
    });

    it('GET /analytics/1?from=2024-03-01T00:00:00Z&to=invalid should return 400 when to date is invalid', () => {
      return request(app.getHttpServer())
        .get('/analytics/1?from=2024-03-01T00:00:00Z&to=invalid-date')
        .expect(400);
    });

    it('GET /analytics/1?from=invalid&to=2024-03-01T00:00:00Z should return 400 when from date is invalid', () => {
      return request(app.getHttpServer())
        .get('/analytics/1?from=invalid-date&to=2024-03-01T00:00:00Z')
        .expect(400);
    });

    it('GET /analytics/1 should return zeros when no readings in date range', () => {
      return request(app.getHttpServer())
        .get('/analytics/1?from=2025-01-01T00:00:00Z&to=2025-12-31T23:59:59Z')
        .expect(200)
        .expect((res) => {
          expect(res.body.average).toBe(0);
          expect(res.body.min).toBe(0);
          expect(res.body.max).toBe(0);
          expect(res.body.readingsCount).toBe(0);
        });
    });
  });
});
