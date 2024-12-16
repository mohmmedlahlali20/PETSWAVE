import {
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schema/user.schema';
import * as nodemailer from 'nodemailer';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto, Role } from './dto/create-auth.dto';



@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(userDto: CreateAuthDto, avatar: string): Promise<any> {
    const { firstName, lastName, email, password, role } = userDto;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role || Role.Client;
  
    const CreateUser = await this.userModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: userRole,
      avatar: avatar, 
    });
  
    return CreateUser.save();
  }
  async login(email: string, password: string): Promise<{ token: string }> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new HttpException(
        'User with this email does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }

    const payload = { email: user.email, id: user._id, role: user.role };
    const token = this.jwtService.sign(payload);

    return { token };
  }


  async forgetPassword(email: string): Promise<any> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const resetToken = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    );

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Click this link to reset your password: ${resetUrl}`,
    };

    await transporter.sendMail(mailOptions);

    return { message: 'Password reset email sent' };
  }

  async resetPassword(token: string, newPassword: string): Promise<any> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
      const user = await this.userModel.findById(decoded.id);

      if (!user) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      return { message: 'Password reset successful' };
    } catch (error) {
      throw new HttpException('Invalid or expired token', HttpStatus.UNAUTHORIZED);
    }
  }

  async uploadProfile(userId: string, avatar: string): Promise<any> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    user.avatar = avatar;
    await user.save();

    return user;
  }
}
