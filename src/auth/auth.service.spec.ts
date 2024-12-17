import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import * as jwt from 'jsonwebtoken';

import { CreateAuthDto, Role } from './dto/create-auth.dto';
import { User } from 'src/users/schema/user.schema';

const mockUserModel = {
  findOne: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;
  let userModel: typeof mockUserModel;
  let jwtService: typeof mockJwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userModel = module.get(getModelToken(User.name));
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const userDto: CreateAuthDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        role: Role.Client,
         avatar:'path/avatar'
      };
      const mockUser = {
        ...userDto,
        password: 'hashedpassword',
        save: jest.fn(),
      };

      userModel.findOne.mockResolvedValue(null);
      userModel.create.mockResolvedValue(mockUser);

      const result = await service.register(userDto, 'avatar.png');

      expect(userModel.findOne).toHaveBeenCalledWith({ email: userDto.email });
      expect(userModel.create).toHaveBeenCalledWith({
        ...userDto,
        password: expect.any(String),
        avatar: 'avatar.png',
      });
      expect(mockUser.save).toHaveBeenCalled();
      expect(result).toBe(mockUser);
    });

    it('should throw an error if user already exists', async () => {
      const userDto: CreateAuthDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        role: Role.Client,
        avatar:'path/avatar'
      };

      userModel.findOne.mockResolvedValue(userDto);

      await expect(service.register(userDto, 'avatar.png')).rejects.toThrow(
        'User with this email already exists',
      );
      expect(userModel.findOne).toHaveBeenCalledWith({ email: userDto.email });
    });
  });

  describe('login', () => {
    it('should login successfully and return a token', async () => {
      const mockUser = {
        email: 'john.doe@example.com',
        password: 'hashedpassword',
        role: Role.Client,
        _id: 'userId',
      };
      const mockToken = 'mockJwtToken';

      userModel.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jwtService.sign.mockReturnValue(mockToken);

      const result = await service.login(mockUser.email, 'password123');

      expect(userModel.findOne).toHaveBeenCalledWith({ email: mockUser.email });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', mockUser.password);
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        id: mockUser._id,
        role: mockUser.role,
      });
      expect(result).toEqual({ token: mockToken });
    });

    it('should throw error if user is not found', async () => {
      userModel.findOne.mockResolvedValue(null);

      await expect(service.login('john.doe@example.com', 'password123')).rejects.toThrow(
        new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw error if password is invalid', async () => {
      const mockUser = {
        email: 'john.doe@example.com',
        password: 'hashedpassword',
      };

      userModel.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(service.login(mockUser.email, 'wrongpassword')).rejects.toThrow(
        new HttpException('Invalid password', HttpStatus.UNAUTHORIZED),
      );
    });
  });

  describe('forgetPassword', () => {
    it('should send reset password email', async () => {
      const mockUser = { email: 'john.doe@example.com', _id: 'userId' };
      const mockToken = 'mockResetToken';

      userModel.findOne.mockResolvedValue(mockUser);
      // jest.spyOn(jwt, 'sign').mockReturnValue(mockToken);

      const result = await service.forgetPassword(mockUser.email);

      expect(userModel.findOne).toHaveBeenCalledWith({ email: mockUser.email });
      expect(jwt.sign).toHaveBeenCalledWith(
        { email: mockUser.email, id: mockUser._id },
        process.env.JWT_SECRET,
        
      );
      expect(result).toEqual({ message: 'Password reset email sent' });
    });

    it('should throw error if user is not found', async () => {
      userModel.findOne.mockResolvedValue(null);

      await expect(service.forgetPassword('john.doe@example.com')).rejects.toThrow(
        new HttpException('User not found', HttpStatus.NOT_FOUND),
      );
    });
  });
});
