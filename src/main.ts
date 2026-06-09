import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
  // console.log('ENV TEST:', process.env.MONGO_URI);
  // console.log('🔥 MONGO_URI =', process.env.MONGO_URI);
  console.log('PUBLIC:', process.env.OMISE_PUBLIC_KEY);
  console.log('SECRET:', process.env.OMISE_SECRET_KEY);
  console.log('ไม่มี error ไอน้องรัก');
}
bootstrap();
