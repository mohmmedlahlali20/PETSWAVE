
import { Controller, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}



  
    @Post('/register')
    @UseInterceptors(
      FileInterceptor('avatar', {
        storage: diskStorage({
          destination: './uploads', 
          filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() ;
            const ext = extname(file.originalname);
            callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
          },
        }),
        fileFilter: (req, file, callback) => {
          if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
            callback(new Error('Only image files are allowed!'), false);
          }
          callback(null, true);
        },
      }),
    )
    async register(
      @Body() userDTO: CreateAuthDto, 
      @UploadedFile() file: Express.Multer.File, 
    ) {
      try {
        if (!file) {
          throw new Error('File upload failed.');
        }
        
        const userRegistered = await this.authService.register(userDTO, file.path);
        
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

   @Post('forget-password')
  async forgetPassword(@Body('email') email: string) {
    return await this.authService.forgetPassword(email);
  }

  @Post('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    return await this.authService.resetPassword(token, newPassword);
  }

  
}
