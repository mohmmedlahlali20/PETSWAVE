import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  console.log(`servuer is runing in port : http://localhost:${process.env.PORT}`)
  await app.listen(process.env.PORT);
}
bootstrap();
