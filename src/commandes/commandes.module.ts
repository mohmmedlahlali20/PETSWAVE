import { Module } from '@nestjs/common';
import { CommandesService } from './commandes.service';
import { CommandesController } from './commandes.controller';

@Module({
  controllers: [CommandesController],
  providers: [CommandesService],
})
export class CommandesModule {}
