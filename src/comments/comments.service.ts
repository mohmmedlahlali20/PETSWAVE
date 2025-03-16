import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comments } from './schemas/comment.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comments.name) private commentsModel: Model<Comments>,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comments> {
    try {
      const writeComment = new this.commentsModel(createCommentDto);
      return (await writeComment.save()).populate('createdBy');
    } catch (error: any) {
      throw new InternalServerErrorException('Failed to create comment', error);
    }
  }

  async findAll(): Promise<Comments[]> {
    try {
      const comments = await this.commentsModel
        .find()
        .populate('petsId')
        .populate('createdBy')
        .exec();

      return comments.length ? comments : [];
    } catch (err: any) {
      throw new InternalServerErrorException('Failed to get all comments', err);
    }
  }

  async getAllCommentsByPetId(petsId: string): Promise<Comments[]> {
    try {
      const comments = await this.commentsModel
        .find({ petsId })
        .populate('createdBy')
        .populate('petsId')
        .exec();
      if (comments.length === 0) {
        throw new NotFoundException(`No comments found for pet ID ${petsId}`);
      }
      return comments;
    } catch (err: any) {
      console.error('Error fetching comments:', err);
      throw new InternalServerErrorException(
        'Failed to fetch comments by pet ID',
      );
    }
  }

  async remove(commentId: string) {
    try {
      const deleteComment =
        await this.commentsModel.findByIdAndDelete(commentId);

      if (!deleteComment) {
        throw new NotFoundException(
          `Comment with ID ${commentId} doesn't exist`,
        );
      }

      return { message: 'Comment deleted successfully' };
    } catch (err: any) {
      throw new InternalServerErrorException('Failed to delete comment', err);
    }
  }
}
