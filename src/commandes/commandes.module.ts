import { Module } from '@nestjs/common';
import { CommandesService } from './commandes.service';
import { CommandesController } from './commandes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Commande, CommandeSchema } from './schema/command.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Commande.name, schema:CommandeSchema}])
  ],
  controllers: [CommandesController],
  providers: [CommandesService],
})
export class CommandesModule {}
