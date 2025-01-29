import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schema/cateogry.schema';
import { Model } from 'mongoose';

@Injectable()
export class CategoryService {

  constructor(@InjectModel(Category.name) private categoryModel: Model<Category>) { }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    console.log('Received Category Data:', createCategoryDto);

    const newCategory = new this.categoryModel(createCategoryDto);
    const savedCategory = await newCategory.save();

    console.log('Saved Category:', savedCategory);
    return savedCategory;
  }

  async findAll(): Promise<Category[]>{
    try {
      const category = await this.categoryModel.find().exec()
      if(category.length === 0 ){
        console.log('no category found')
        return []
      }
      return category
    } catch (err) {
      console.error('Error while fetching all category:', err);
      throw new Error('Failed to get all category');
    }

  }



}
