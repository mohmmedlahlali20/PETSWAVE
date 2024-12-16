import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { Category } from 'src/category/schema/cateogry.schema';

export type PetsDocument = Pets & Document;

@Schema({ timestamps: true })
export class Pets {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  age: number;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category: Category;

  @Prop({ type: [String], required: true })
  images: string[];

  @Prop({ required: true })
  description: string;
}

export const PetsSchema = SchemaFactory.createForClass(Pets);
