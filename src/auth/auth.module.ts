import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { User, UserSchema } from 'src/users/schema/user.schema';
import { MinioModule } from 'src/MinioService/minio.module';
import 'dotenv/config'

@Module({ 
  imports: [
    MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    MinioModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}