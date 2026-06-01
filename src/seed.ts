import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const usersService = app.get(UsersService);

  const email = 'admin@gmail.com';
  const password = '1234567890';

  try {
    const existing = await usersService.findByEmail(email);

    if (existing) {
      console.log('✅ Admin already exists');
      return;
    }
  } catch (e) {
    // not found → continue
  }

  await usersService.createUser(email, password, 'admin');
  console.log('🔥 Admin created');

  await app.close();
}

bootstrap();
