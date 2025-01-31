import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommandesService } from './commandes.service';
import { CreateCommandeDto } from './dto/create-commande.dto';
import { UpdateCommandeDto } from './dto/update-commande.dto';
import { PetsService } from 'src/pets/pets.service';

@Controller('commandes')
export class CommandesController {
  constructor(
    private readonly commandesService: CommandesService,
    private readonly PetsService: PetsService,
  ) {}

  @Post("/Passe_commandes")
  create(@Body() createCommandeDto: CreateCommandeDto) {
    return this.commandesService.create(createCommandeDto);
  }

 
}
