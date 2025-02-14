import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

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

}
