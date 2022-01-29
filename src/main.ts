import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';
dayjs?.extend(utc);

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
      credentials: true,
    },
  });
  await app.listen(3001);
}
bootstrap();
