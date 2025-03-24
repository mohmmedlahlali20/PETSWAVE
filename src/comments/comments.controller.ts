import { Controller, Get, Post, Body, Param, Delete, UseGuards } from "@nestjs/common";
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../guards/auth.guard';
import { Roles } from "../common/Role.decrotor";

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':CreatedBy')
  create(
    @Param('CreatedBy') createdBy: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.create({ ...createCommentDto, createdBy });
  }

  @Get('findAll')
  @Roles('Admin')
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
