import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './schema/cateogry.schema';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post('/create_Category')
  create(@Body() createCategoryDto: CreateCategoryDto) {

    return this.categoryService.create(createCategoryDto);
  }

  @Get('/GetAll')
  async getAllCategory() {
    return this.categoryService.findAll()
  }

  @Delete(':categoryId')
  async removeCategory(@Param('categoryId') categoryId: string) {
    const deletedCategory = await this.categoryService.removeCategory(categoryId);
    if (deletedCategory) {
      return { message: 'Category deleted successfully', deletedCategory };
    } else {
      return { message: 'Category not found' };
    }
  }

  @Put(':id')
  async update(
    @Param('id') categoryId: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category | null> {
    return this.categoryService.updateCategory(updateCategoryDto, categoryId);
  }

}
