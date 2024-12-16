import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}



  @Post('/register')
  async register(@Body() userDTO: CreateAuthDto){
    try{
      const userRregitred = await this.authService.register(userDTO)
      return {
        message: 'User been registered successfully',
        user: userRregitred,
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
    }  }
}
