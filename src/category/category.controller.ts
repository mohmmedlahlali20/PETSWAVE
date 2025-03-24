import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './schema/cateogry.schema';
import { JwtAuthGuard } from '../guards/auth.guard';
import { Roles } from '../common/Role.decrotor';
//mohammedlahlali mohammedlahlalihh@gmail.com
@Controller('category')
@UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/create_Category')
  @Roles('Admin')
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get('/GetAll')
  async getAllCategory() {
    return this.categoryService.findAll();
  }
        
  @Delete(':categoryId')
  async removeCategory(@Param('categoryId') categoryId: string) {
    const deletedCategory =
      await this.categoryService.removeCategory(categoryId);
    if (deletedCategory) {
      return { message: 'Category deleted successfully', deletedCategory };
    } else {
      return { message: 'Category not found' };
    }
  }

  @Put(':id')
  @Roles('Admin')
  async update(
    @Param('id') categoryId: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category | null> {
    return this.categoryService.updateCategory(updateCategoryDto, categoryId);
  }
}
