import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.enableCors({
    origin: ['http://localhost:5000'],
  });
  app.useGlobalPipes(new ValidationPipe());
  app.use('/uploads', express.static(join(__dirname, '..', 'public/uploads')));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
