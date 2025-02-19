import { Module } from '@nestjs/common';
import { PetsService } from './pets.service';
import { PetsController } from './pets.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pets, PetsSchema } from './schema/pets.schema';
import { MinioModule } from 'src/minio/minio.module';


@Module({
  imports : [
        MongooseModule.forFeature([{name: Pets.name, schema: PetsSchema}]),
        MinioModule,
  ],
  controllers: [PetsController],
  providers: [PetsService],
  exports: [PetsService],
})
export class PetsModule {}
