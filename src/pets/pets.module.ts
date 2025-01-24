import { Module } from '@nestjs/common';
import { PetsService } from './pets.service';
import { PetsController } from './pets.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pets, PetsSchema } from './schema/pets.schema';
import { MulterModule } from '@nestjs/platform-express';
import { MinioService } from 'src/MinioService/minio.service';
import { MinioModule } from 'src/MinioService/minio.module';

@Module({
  imports : [
        MongooseModule.forFeature([{name: Pets.name, schema: PetsSchema}]),
        MulterModule.register({
          dest: './petsIMG',
        }),
        MinioModule
  ],
  controllers: [PetsController],
  providers: [PetsService, MinioService],
})
export class PetsModule {}
