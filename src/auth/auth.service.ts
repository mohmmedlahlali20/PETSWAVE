import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schema/user.schema';
import * as nodemailer from 'nodemailer';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto, Role } from './dto/create-auth.dto';
import { MinioService } from 'src/minio/minio.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly minioService: MinioService,
  ) { }

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

  async login(email: string, password: string): Promise<{ token: string, user: User }> {
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

    return { token, user };
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
      html: generateOtpEmail(otp),
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




  async resetPassword(email: string, newPassword: string): Promise<any> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (user.otp !== undefined) {
      throw new HttpException('OTP verification required', HttpStatus.FORBIDDEN);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return { message: 'Password reset successful' };
  }


  async uploadAvatar(userId: string, file: Express.Multer.File): Promise<User> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (!file) {
      throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
    }

    const bucketName = 'avatars';
    const avatarFileName = await this.minioService.uploadFile(bucketName, file);
    const avatarUrl = `http://localhost:9000/${bucketName}/${avatarFileName}`;

    user.avatar = avatarUrl;
    await user.save();

    return user;
  }

  async profile(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }
}








function generateOtpEmail(otp) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 500px;
        margin: 30px auto;
        background: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        text-align: center;
      }
      .header {
        font-size: 24px;
        color: #333;
        margin-bottom: 20px;
      }
      .otp {
        font-size: 28px;
        font-weight: bold;
        color: #007BFF;
        margin: 20px 0;
        display: inline-block;
        padding: 10px 20px;
        border-radius: 5px;
        background: #e9f5ff;
      }
      .footer {
        font-size: 14px;
        color: #777;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">Your OTP Code</div>
      <p>Please use the following OTP to verify your account. This OTP is valid for 10 minutes.</p>
      <div class="otp">${otp}</div>
      <p>If you did not request this, please ignore this email.</p>
      <div class="footer">&copy; ${new Date().getFullYear()} PetsWave. All rights reserved.</div>
    </div>
  </body>
  </html>
  `;
}
