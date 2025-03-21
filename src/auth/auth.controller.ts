import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Patch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioService } from '../minio/minio.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly minioService: MinioService,
  ) {}

  @Post('/register')
  @UseInterceptors(
    FileInterceptor('avatar', {
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async register(
    @Body() userDTO: CreateAuthDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    console.log('DTO', userDTO);

    try {
      let avatarUrl = null;

      if (file) {
        const bucketName = 'avatars';
        console.log(bucketName);
        const avatarFileName = await this.minioService.uploadFile(
          bucketName,
          file,
        );
        console.log(avatarFileName);
        avatarUrl = `http://localhost:9000/${bucketName}/${avatarFileName}`;
        console.log(avatarUrl);
      }

      const userRegistered = await this.authService.register(
        userDTO,
        avatarUrl,
      );

      return {
        message: 'User has been registered successfully',
        user: userRegistered,
      };
    } catch (error) {
      throw error;
    }
  }

  @Patch('/update-profile/:userId')
  async updateUserAvatar(
    @Param('userId') userId: string,
    @Body('avatar') avatarUrl: string,
  ) {
    console.log(avatarUrl);

    if (!avatarUrl) {
      throw new HttpException('Avatar URL is required', HttpStatus.BAD_REQUEST);
    }

    const updatedUser = await this.authService.updateAvatar(userId, avatarUrl);

    return {
      message: 'Profile updated successfully',
      user: updatedUser,
    };
  }

  @Post('verify-otp')
  async verifyOtp(@Body() body: { email: string; otp: number }) {
    return this.authService.verifyOtp(body.email, body.otp);
  }

  @Post('/login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    try {
      return await this.authService.login(email, password);
    } catch (error) {
      throw error;
    }
  }

  @Post('/forget-password')
  async forgetPassword(@Body('email') email: string) {
    return await this.authService.forgetPassword(email);
  }

  @Post('/reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    return await this.authService.resetPassword(token, newPassword);
  }

  @Get('/profile/:userId')
  async ProfileUser(@Param('userId') userId: string) {
    return await this.authService.profile(userId);
  }
}
