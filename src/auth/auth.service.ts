import { Injectable } from '@nestjs/common';
import { CreateAuthDto, Role } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User } from 'src/users/schema/user.schema';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,

  ) { }


  async register(userDto: CreateAuthDto): Promise<any> {
    const { firstName, lastName, email, password, role } = userDto;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role || Role.Client
    const CreateUser = await this.userModel.create({
      firstName,
      lastName,
      email,
      password:hashedPassword ,
      role: userRole,
    });

    return  CreateUser.save();

  }
}
