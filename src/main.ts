import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ValidationPipe for transforming query parameters
  app.useGlobalPipes(new ValidationPipe({ 
    transform: true, 
    transformOptions: { enableImplicitConversion: true } 
  }));

  const config = new DocumentBuilder()
    .setTitle('Patient Heart Rate Monitoring API')
    .setDescription('API for managing patients and their heart rate readings')
    .setVersion('1.0')
    .addTag('patients')
    .addTag('heart-rate')
    .addTag('analytics')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: 'http://localhost:3001'
  });

  await app.listen(3000);
}
bootstrap();