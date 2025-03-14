import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schema/cateogry.schema';
import { Model } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<Category>) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return await this.categoryModel.create(createCategoryDto);
  }

  async findAll(): Promise<Category[]> {
    try {
      const categories = await this.categoryModel.find().exec();
      if (categories.length === 0) {
        console.log('No categories found');
        return [];
      }
      return categories;
    } catch (err) {
      console.error('Error while fetching all categories:', err);
      throw new Error('Failed to get all categories');
    }
  }

  async removeCategory(categoryId: string): Promise<Category | null> {
    try {
      const category = await this.categoryModel.findByIdAndDelete(categoryId).exec();
      if (!category) {
        console.log('Category not found');
        return null;
      }
      return category;
    } catch (err) {
      console.error('Error while removing category:', err);
      throw new Error('Failed to remove category');
    }
  }


  async updateCategory(updateDto: UpdateCategoryDto, categoryId: string): Promise<Category> {
    try {
      const updatedCategory = await this.categoryModel.findByIdAndUpdate(
        categoryId,
        { $set: updateDto },
        { new: true }
      ).exec();
  
      if (!updatedCategory) {
        console.log('Category not found');
        return null;
      }
  
      return updatedCategory;
    } catch (err) {
      console.error('Error while updating category:', err);
      throw new Error('Failed to update category');
    }
  }
  
}
