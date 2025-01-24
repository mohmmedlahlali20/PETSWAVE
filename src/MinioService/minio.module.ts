import { Module } from '@nestjs/common';
import { MinioService } from './minio.service';
import 'dotenv/config'

@Module({
  providers: [MinioService],
  exports: [MinioService],
})
export class MinioModule {}
