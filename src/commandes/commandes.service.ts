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
    const commandeData = {
      ...commendsDTO,
    };

    const newCommande = new this.commandeModel(commandeData);
    const savedCommande = await newCommande.save();

    await this.petsModel.findByIdAndUpdate(commendsDTO.petsId, { isAvailable: false });

    return savedCommande;
  }
}
