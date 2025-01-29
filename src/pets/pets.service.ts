import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Pets, PetsDocument } from './schema/pets.schema';
import { CreatePetDto } from './dto/create-pet.dto';
import { PetsResponse } from './dto/pets-response.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { log } from 'node:console';

@Injectable()
export class PetsService {
  constructor(@InjectModel(Pets.name) private readonly petsModel: Model<PetsDocument>) {}

  async create(createPetDto: CreatePetDto, imagePaths: string[]): Promise<Pets> {
    
  
  
    const petData = {
      ...createPetDto,
      images: imagePaths,
    };
  
    const newPet = new this.petsModel(petData);
    return newPet.save();
  }

  async getPetsById(petsId: string): Promise<Pets> {
    try {
      const pet = await this.petsModel.findById(petsId).populate('category');
      if (!pet) {
        console.error(`Pet with ID ${petsId} not found`);
        throw new Error(`Pet with ID ${petsId} not found`);
      }
      return pet;
    } catch (err) {
      console.error(`Error while fetching pet by ID: ${err.message}`);
      throw new Error('Failed to get pet by ID');
    }
  }
  

  async getAllPets(): Promise<PetsResponse> {
    try {
      const pets = await this.petsModel.find().populate('category');

      if (pets.length === 0) {
        console.log('No Pets found');
        return { message: 'No pets found', pets: [] };
      }

      return { message: 'Get all pets', pets };
    } catch (err) {
      console.error('Error while fetching all pets:', err);
      throw new Error('Failed to get all pets');
    }
  }       

  async getPetsByCategoryID(categoryId: string): Promise<PetsResponse> {
    try {
      const pets = await this.petsModel.find({ category: categoryId }).populate('category');

      if (pets.length === 0) {
        console.log(`No pets found for category ID: ${categoryId}`);
        return { message: 'No pets found for this category', pets: [] };
      }

      return { message: 'Get pets by category ID', pets };
    } catch (err) {
      console.error('Error while fetching pets by category ID:', err);
      throw new Error('Failed to get pets by category ID');
    }
  }

  async removePets(petsId: string): Promise<{ message: string; deletedPet?: Pets }> {
    try {
      const deletedPet = await this.petsModel.findByIdAndDelete(petsId);
      if (!deletedPet) {
        return { message: `Pet with ID ${petsId} not found` };
      }

      return { message: 'Pet removed successfully', deletedPet };
    } catch (err) {
      console.error('Error while removing pet:', err);
      throw new Error('Failed to remove pet');
    }
  }

  async update(petsId: string, updateDTO: Partial<UpdatePetDto>): Promise<Pets> {
    try {
      const updatedPet = await this.petsModel.findByIdAndUpdate(
        petsId,
        { $set: updateDTO }, 
        { new: true },
      );
      
      if (!updatedPet) {
        throw new Error('Pet not found');
      }
  
      return updatedPet;
    } catch (err) {
      console.error('Error while updating pet:', err);
      throw new Error('Failed to update pet');
    }
  }
 
}
