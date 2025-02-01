import { Module } from '@nestjs/common';
import { CommandesService } from './commandes.service';
import { CommandesController } from './commandes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Commande, CommandeSchema } from './schema/command.schema';
import { PetsModule } from 'src/pets/pets.module';
import { Pets, PetsSchema } from 'src/pets/schema/pets.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Commande.name, schema:CommandeSchema},
      {name: Pets.name, schema: PetsSchema },
    ]),
    PetsModule,
  ],
  controllers: [CommandesController],
  providers: [CommandesService],
})
export class CommandesModule {}
