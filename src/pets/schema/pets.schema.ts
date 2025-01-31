import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { Category } from 'src/category/schema/cateogry.schema';

export type PetsDocument = Pets & Document;

@Schema({ timestamps: true })
export class Pets {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ['Male', 'Female'] })
  gender: string;

  @Prop({ required: true })
  age: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category', required: true })
  category: Types.ObjectId;

  @Prop({ type: [String], required: true })
  images: string[];

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  Prix: number;

  @Prop({ default: true })
  isAvailable: boolean;
}

export const PetsSchema = SchemaFactory.createForClass(Pets);
