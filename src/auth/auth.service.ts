import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
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

  async register(userDto: CreateAuthDto, avatarUrl: string): Promise<any> {
    const { firstName, lastName, email, password, role } = userDto;

    console.log(userDto)

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    const CreateUser = await this.userModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: Role.Client,
      avatar: avatarUrl || null,
    });

    return CreateUser.save();
  }

  async login(email: string, password: string): Promise<{ token: string }> {
    console.log('email', email);
    const user = await this.userModel.findOne({ email });
    console.log('user', user);

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

    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); 
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    await this.sendOtpEmail(email, otp); 

    return { message: 'OTP sent to email' };
}
async sendOtpEmail(email: string, otp: number) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}. It will expire in 10 minutes.`,
  };

  await transporter.sendMail(mailOptions);
}


async verifyOtp(email: string, otp: number): Promise<any> {
  const user = await this.userModel.findOne({ email });

  if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  if (!user.otp || user.otp !== otp || new Date() > user.otpExpires) {
      throw new HttpException('Invalid or expired OTP', HttpStatus.BAD_REQUEST);
  }

  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  return { message: 'OTP verified successfully' };
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
