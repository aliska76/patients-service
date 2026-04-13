# Patient Heart Rate Monitoring API

A RESTful API service built with NestJS for managing patients and their heart rate readings. The service provides heart rate analytics, high heart rate event detection, and request tracking functionality.

The implementation focuses on clean architecture, separation of concerns, and scalability while keeping the solution lightweight and aligned with the assignment requirements.

## Features

- **High Heart Rate Events**: Retrieve all instances where a patient's heart rate exceeds 100 bpm
- **Heart Rate Analytics**: Calculate average, minimum, and maximum heart rate values per patient within a specified time range
- **Patient Request Tracking**: Track how many times each patient's data has been requested
- **Pagination**: Support for paginated responses on collection endpoints
- **API Documentation**: Interactive Swagger documentation
- **Input Validation**: Request validation using class-validator
- **Error Handling**: Comprehensive error responses with appropriate HTTP status codes

## Technology Stack

- NestJS 20.x
- TypeScript 5.x
- Jest for unit and  e2etesting
- Swagger for API documentation
- class-validator for input validation

## Installation

```bash
npm install
```

## Configuration
### TypeScript Path Aliases
The project uses path aliases for cleaner imports. Configured aliases in tsconfig.json:

## Seed Data
The application loads mock patient and heart rate data from patients.json file located in the project root during startup.

## Running the Application
```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

The server will start on http://localhost:3000

## API Endpoints
### Patients

| Method | Endpoint | Description |
|--|--|--|
|GET |	/patients	| Get all patients with pagination |
|GET |	/patients/:id	| Get patient by ID |
|GET |	/patients/:id/request-count	| Get request count for a patient |

**Query Parameters for /patients:**

- offset (optional, default: 0) - Number of items to skip
- limit (optional, default: 10, max: 100) - Maximum items to return

### Heart Rate

| Method | Endpoint | Description |
|--|--|--|
|GET |	/heart-rate/high-events	| Get all heart rate events above 100 bpm with pagination |
|GET |	/heart-rate/patient/:patientId	| Get all heart rate readings for a patient |

**Query Parameters:**

- from (required) - Start date in ISO format
- to (required) - End date in ISO format

#### Analytics
| Method | Endpoint | Description |
|--|--|--|
|GET |	/analytics/:patientId	| Get heart rate statistics for a patient within a date range |

**Query Parameters:**

- from (required) - Start date in ISO format
- to (required) - End date in ISO format

## API Documentation
Interactive Swagger documentation is available at: http://localhost:3000/api

### Testing
```bash
# Unit tests
npm run test

# Unit tests with watch mode
npm run test:watch

# Unit tests with coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

### Error Handling
The API returns appropriate HTTP status codes:

| Status Code | Description |
|--|--|
|200 | Success |
|400 | Bad Request (invalid date format, date range, or pagination parameters) |
|404 | Not Found (patient does not exist) |

## Suggested Improvements
1. ***Request Tracking Persistence:*** Currently uses in-memory storage with Map. For production, implement Redis for distributed and persistent request counting.

2. ***Database Integration:*** Replace in-memory repositories with PostgreSQL using TypeORM or Prisma for data persistence.

3. Caching:*** Implement Redis caching for analytics endpoints to improve performance for frequently requested data.

4. ***Authentication & Authorization:*** Add JWT-based authentication with role-based access control (doctor, patient, admin).

5. ***Rate Limiting:*** Implement rate limiting using @nestjs/throttler to prevent API abuse.

6. ***Logging:*** Add structured logging with Winston or Pino for better observability.

7. ***Metrics:*** Export Prometheus metrics for monitoring API performance and request patterns.

8. ***Data Export:*** Add endpoints to export analytics data in CSV or PDF format.

9. ***WebSocket Notifications:*** Implement real-time notifications for high heart rate events.

10. ***API Versioning:*** Add API versioning (e.g., /v1/patients) for future backward compatibility.

11. ***Integrate monitoring*** (e.g., Prometheus)
