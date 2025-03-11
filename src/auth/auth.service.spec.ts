import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { Model } from 'mongoose';
import { Role } from './dto/create-auth.dto';
import { AuthService } from './auth.service';
import { MinioService } from 'src/minio/minio.service';
import { User } from 'src/users/schema/user.schema';

const mockUser = {
  _id: 'user123',
  firstName: 'John',
  lastName: 'Doe',
  email: 'test@example.com',
  password: 'hashedpassword',
  role: 'client',
  avatar: null,
};

const mockUserModel = {
  findOne: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  save: jest.fn(),
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
    it('should create a new user', async () => {
      mockUserModel.findOne.mockResolvedValue(null);
      mockUserModel.create.mockResolvedValue(mockUser);

      const result = await authService.register(
        {
          email: 'test@example.com',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
          role: Role.Client,
          avatar: null
        },
        null
      );

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(mockUserModel.create).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

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
            avatar: null
          },
          null
        )
      ).rejects.toThrow('User with this email already exists');
    });
  });

  // ✅ Test de la connexion
  describe('login', () => {
    it('should return a JWT token for valid credentials', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await authService.login('test@example.com', 'password123');

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(result).toHaveProperty('token', 'mocked-jwt-token');
      expect(result).toHaveProperty('user', mockUser);
    });

    it('should throw error if user does not exist', async () => {
      mockUserModel.findOne.mockResolvedValue(null);

      await expect(authService.login('unknown@example.com', 'password123')).rejects.toThrow(
        'User with this email does not exist'
      );
    });

    it('should throw error if password is incorrect', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(authService.login('test@example.com', 'wrongpassword')).rejects.toThrow(
        'Invalid password'
      );
    });
  });
});
