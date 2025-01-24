import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MinioModule } from 'src/MinioService/minio.module';

@Module({
  imports: [MinioModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
