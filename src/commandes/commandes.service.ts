import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCommandeDto } from './dto/create-commande.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Commande, CommandeDocument } from './schema/command.schema';
import { Model } from 'mongoose';
import { Pets, PetsDocument } from 'src/pets/schema/pets.schema';

@Injectable()
export class CommandesService {
  constructor(
    @InjectModel(Commande.name) private readonly commandeModel: Model<CommandeDocument>,
    @InjectModel(Pets.name) private readonly petsModel: Model<PetsDocument>,
  ) {}

  async create(commandsDTO: CreateCommandeDto): Promise<CommandeDocument> {
    const pets = await this.petsModel.find({ _id: { $in: commandsDTO.petsId } });

    if (!pets.length) {
        throw new BadRequestException('No valid pets found');
    }

    const totalAmount = pets.reduce((sum, pet) => sum + pet.Prix, 0);
    console.log(totalAmount);
    

    if (commandsDTO.totalAmount !== undefined && Math.abs(commandsDTO.totalAmount - totalAmount) > 0.01) {
        throw new BadRequestException('Total amount does not match the sum of pet prices');
    }

    const newCommande = await this.commandeModel.create({ 
        ...commandsDTO, 
        totalAmount 
    });

    await this.petsModel.updateMany(
        { _id: { $in: commandsDTO.petsId } },
        { isAvailable: false }
    );

    return newCommande;
}




  async getAllCommandes(): Promise<CommandeDocument[]> {
    return this.commandeModel.find().populate('userId').populate('petsId');
  }

  async getCommandeByUserId(userId: string): Promise<CommandeDocument[]> {
  return this.commandeModel.find({ userId }).populate('userId').populate('petsId');
}


  


}
