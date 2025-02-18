import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Pets } from 'src/pets/schema/pets.schema';
import { User } from 'src/users/schema/user.schema';

export type CommandeDocument = Commande & Document;

@Schema({ timestamps: true })
export class Commande {
  @Prop({ type: [Types.ObjectId], ref: 'Pets', required: true })
  petsId: Types.ObjectId[] | Pets[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId | User;

  @Prop({
    type: String,
    enum: ['pending', 'in progress', 'completed', 'cancelled'],
    default: 'pending',
  })
  status: string;

  @Prop({ type: Date, default: Date.now })
  orderDate: Date;

  @Prop({ type: Number, required: true, min: 0 })
  totalAmount: number;
}



export const CommandeSchema = SchemaFactory.createForClass(Commande);
