import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { CreateAuthDto, Role } from './dto/create-auth.dto';
import { AuthService } from './auth.service';
import { MinioService } from '../minio/minio.service';
import { User } from '../users/schema/user.schema';
import { HttpException, HttpStatus } from '@nestjs/common';

const mockUser = {
  _id: 'M123M123',
  firstName: 'test',
  lastName: 'test',
  email: 'testing@gmail.com',
  password: 'hashedPassword',
  role: Role.Client,
  avatar: null,
  otp: undefined,
  otpExpires: undefined,
  save: jest.fn(),
};

const mockUserModel = {
  findOne: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mocked-jwt-token'),
};

const mockMinioService = {
  uploadFile: jest.fn().mockResolvedValue('mock-avatar-url'),
};

describe('AuthService', () => {
  let authService: AuthService;
  let userModel: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
        { provide: JwtService, useValue: mockJwtService },
        { provide: MinioService, useValue: mockMinioService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {


    it('should throw error if user already exists', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);

      await expect(
        authService.register(
          {
            email: 'test@example.com',
            password: 'password123',
            firstName: 'John',
            lastName: 'Doe',
            role: Role.Client,
            avatar: null,
          },
          null,
        ),
      ).rejects.toThrowError(new Error('User with this email already exists'));
    });
  });

  describe('login', () => {
    it('should return a JWT token for valid credentials', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await authService.login(
        'testing@gmail.com',
        'password123',
      );

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: 'testing@gmail.com',
      });
      expect(result).toHaveProperty('token', 'mocked-jwt-token');
      expect(result).toHaveProperty('user', mockUser);
    });

    it('should throw error if user does not exist', async () => {
      mockUserModel.findOne.mockResolvedValue(null);

      await expect(
        authService.login('unknown@example.com', 'password123'),
      ).rejects.toThrow(new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND));
    });

    it('should throw error if password is incorrect', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(
        authService.login('testing@gmail.com', 'wrongpassword'),
      ).rejects.toThrow(new HttpException('Invalid password', HttpStatus.UNAUTHORIZED));
    });
  });

  describe('updateAvatar', () => {
    it('should update user avatar', async () => {
      mockUserModel.findById.mockResolvedValue(mockUser);

      const result = await authService.updateAvatar('M123M123', 'new-avatar-url');

      expect(mockUserModel.findById).toHaveBeenCalledWith('M123M123');
      expect(mockUser.avatar).toBe('new-avatar-url');
      expect(mockUser.save).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should throw error if user is not found', async () => {
      mockUserModel.findById.mockResolvedValue(null);

      await expect(
        authService.updateAvatar('unknownId', 'new-avatar-url'),
      ).rejects.toThrow(
        new HttpException('User not found', HttpStatus.NOT_FOUND),
      );
    });
  });
});
