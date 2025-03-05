import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':CreatedBy')
  create(
    @Param('CreatedBy') CreatedBy: string,
    @Body() createCommentDto: CreateCommentDto
  ) {
    return this.commentsService.create({ ...createCommentDto, CreatedBy });
  }

  @Get()
  findAll() {
    return this.commentsService.findAll();
  }

  @Get(':petId')
async getCommentsByPetId(@Param('petId') petId: string) {
  return await this.commentsService.getAllCommentsByPetId(petId);
}

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(id);
  }
}
