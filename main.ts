import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { cors: true });
  const port = process.env.PORT || 8080;
  await app.listen(port);
  console.log(`Backend running on :${port}`);
}

bootstrap();
