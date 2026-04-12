<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# Backend Design Overview

## Overview

This service provides a backend for managing patients and their heart rate readings. The system is designed with a focus on clean architecture, separation of concerns, and scalability, while keeping the implementation lightweight and suitable for the scope of the assignment.

The application is built using NestJS and follows a modular structure, separating domain logic, infrastructure, and cross-cutting concerns.

## Architecture

The system follows a layered architecture with clear responsibility boundaries:

### 1. Controllers (Transport Layer)
Controllers handle HTTP requests and responses. They are responsible only for routing and delegating work to services.

### 2. Services (Business Logic)
Services contain all core business logic, including:
- Filtering high heart rate events
- Calculating analytics (average, min, max)
- Coordinating data access

### 3. Repositories (Data Access Layer)
Repositories abstract access to data. In this implementation, data is stored in memory, but the repository pattern allows easy replacement with a database in the future.

### 4. Infrastructure Layer
Responsible for:
- Loading seed data from a JSON file
- Providing repository implementations

### 5. Cross-Cutting Concerns
Handled separately from business logic:
- Request tracking implemented using an interceptor
- Input validation using DTOs and class-validator

## Domain Structure

The application is divided into the following modules:

- **Patients Module** – handles patient retrieval and request tracking
- **Heart Rate Module** – manages heart rate readings and high heart rate detection
- **Analytics Module** – calculates statistics per patient within a time range

This modular structure improves maintainability and scalability.

## Data Storage

The application uses an in-memory data store initialized from a JSON file.

**Advantages:**
- Simple and fast setup
- No external dependencies

**Trade-offs:**
- Data is not persistent
- Not suitable for distributed systems

In a production environment, this layer can be replaced with a database (e.g., PostgreSQL) without affecting business logic.

## API Design

The API is designed around three main resources: patients, heart rate readings, and analytics.

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/patients` | Get all patients with pagination |
| GET | `/patients/:id` | Retrieve a patient by ID |
| GET | `/patients/:id/request-count` | Retrieve how many times the patient's data has been requested |
| GET | `/heart-rate/high-events` | Retrieve all heart rate readings above 100 bpm with pagination |
| GET | `/heart-rate/patient/:patientId` | Get all heart rate readings for a patient |
| GET | `/analytics/:patientId?from=&to=` | Calculate average, minimum, and maximum heart rate values within a time range |

### Pagination

Collection endpoints support pagination with the following query parameters:

- `offset` (default: 0) – Number of items to skip
- `limit` (default: 10, max: 100) – Maximum number of items to return

**Paginated Response Format:**
```json
{
  "data": [...],
  "total": 42,
  "offset": 0,
  "limit": 10,
  "hasMore": true
}
