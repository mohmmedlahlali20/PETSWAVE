import { Injectable } from '@nestjs/common';
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

  async create(commendsDTO: CreateCommandeDto): Promise<CommandeDocument> {
    const pets = await this.petsModel.find({ _id: { $in: commendsDTO.petsId } });
    if (!pets || pets.length === 0) {
        throw new Error('No valid pets found');
    }
    const totalAmount = pets.reduce((sum, pet) => sum + pet.Prix, 0);
    if (commendsDTO.totalAmount!== totalAmount) {
        throw new Error('Total amount does not match the sum of pet prices');
    }
    const commandeData = {
        ...commendsDTO,
        totalAmount,
    };
    const newCommande = new this.commandeModel(commandeData);
    const savedCommande = await newCommande.save();
    await this.petsModel.updateMany(
        { _id: { $in: commendsDTO.petsId } },
        { isAvailable: false }
    );

    return savedCommande;
}



  async getAllCommandes(): Promise<CommandeDocument[]> {
    return this.commandeModel.find().populate('userId').populate('petsId');
  }

  async getCommandeByUserId(userId: string): Promise<CommandeDocument> {
    return this.commandeModel.findOne({ userId }).populate('userId').populate('petsId');
  }

  


}
