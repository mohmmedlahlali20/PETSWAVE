
import { Controller, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioService } from 'src/minio/minio.service';

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
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('DTO',userDTO)
    try {
      if (!file) {
        throw new Error('File upload failed.');
      }

      const bucketName = 'avatars';
      console.log(bucketName)
      const avatarFileName = await this.minioService.uploadFile(bucketName, file);
      console.log(avatarFileName);
      
      const avatarUrl = `http://localhost:9000/${bucketName}/${avatarFileName}`;
      console.log(avatarUrl);
      
    

      const userRegistered = await this.authService.register(userDTO, avatarUrl);

      return {
        message: 'User has been registered successfully',
        user: userRegistered,
      };
    } catch (error) {
      throw error;
    }
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

  
}
