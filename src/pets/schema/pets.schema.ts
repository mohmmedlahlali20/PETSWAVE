import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PetsDocument = Pets & Document;

@Schema({ timestamps: true })
export class Pets {

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true })
  category: string;

  @Prop({ type: [String], required: true }) 
  images: string[];

  @Prop({ required: true })
  descr: string;
}

export const PetsSchema = SchemaFactory.createForClass(Pets);
