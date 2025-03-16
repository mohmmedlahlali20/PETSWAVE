import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly UsersModule: Model<UserDocument>,
  ) {}

  async findAll(): Promise<User[]> {
    try {
      const users = await this.UsersModule.find().exec();
      return users;
    } catch (err) {
      console.error('Error while fetching all users:', err);
      throw new Error('Failed to get all users');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
}
