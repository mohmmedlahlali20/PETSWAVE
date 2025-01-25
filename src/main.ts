import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  console.log(`this projet runing in this port : http://localhost:${process.env.PORT}`)
  await app.listen(process.env.PORT);
}
bootstrap();
