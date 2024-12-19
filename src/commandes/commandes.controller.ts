import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommandesService } from './commandes.service';
import { CreateCommandeDto } from './dto/create-commande.dto';
import { UpdateCommandeDto } from './dto/update-commande.dto';

@Controller('commandes')
export class CommandesController {
  constructor(private readonly commandesService: CommandesService) {}

  @Post()
  create(@Body() createCommandeDto: CreateCommandeDto) {
    
  }

 
}
