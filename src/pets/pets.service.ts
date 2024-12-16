import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pets, PetsDocument } from './schema/pets.schema';
import { CreatePetDto } from './dto/create-pet.dto';

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
}
