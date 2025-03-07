import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':CreatedBy')
  create(
    @Param('CreatedBy') createdBy: string,
    @Body() createCommentDto: CreateCommentDto
  ) {
    return this.commentsService.create({ ...createCommentDto, createdBy });
  }

  @Get('findAll')
  findAll() {
    return this.commentsService.findAll();
  }

  @Get(':petId')
async getCommentsByPetId(@Param('petId') petId: string) {
  return await this.commentsService.getAllCommentsByPetId(petId);
}

  @Delete(':commentId')
  remove(@Param('commentId') commentId: string) {
    return this.commentsService.remove(commentId);
  }
}
