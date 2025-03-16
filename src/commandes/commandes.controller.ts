import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CommandesService } from './commandes.service';
import { CreateCommandeDto } from './dto/create-commande.dto';

@Controller('commandes')
export class CommandesController {
  constructor(private readonly commandesService: CommandesService) {}

  @Post('/Passe_commandes')
  create(@Body() createCommandeDto: CreateCommandeDto) {
    return this.commandesService.create(createCommandeDto);
  }

  @Get('/GetAllCommandes')
  async getAllCommandes() {
    const allCommandes = await this.commandesService.getAllCommandes();
    return {
      message: 'All Commandes',
      allCommandes,
    };
  }

  @Get('/GetCommandeByUserId/:userId')
  async getCommandeByUserId(@Param('userId') userId: string) {
    const userCommandes =
      await this.commandesService.getCommandeByUserId(userId);
    if (!userCommandes) {
      return {
        message: 'No Commandes found for this user',
        userCommandes: [],
      };
    }
    return {
      message: 'Commandes found for this user',
      userCommandes,
    };
  }
}
