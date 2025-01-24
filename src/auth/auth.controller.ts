
import { Controller, Post, Body, UseInterceptors, UploadedFile, Inject } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioService } from 'src/MinioService/minio.service';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(MinioService) private minioService: MinioService
  ) {}



  
  
  
  @Post('/register')
  @UseInterceptors(FileInterceptor('avatar'))
  async register(
    @Body() userDTO: CreateAuthDto, 
    @UploadedFile() file: Express.Multer.File  ) {
    try {
      if (!file) {
        throw new Error('File upload failed.');
      }
      console.log(file);
      
      console.log(userDTO);

      
      
  
      const fileName = await this.minioService.uploadFile('avatars', file);
      console.log(fileName);
      
      const userRegistered = await this.authService.register(userDTO, fileName);
      
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
