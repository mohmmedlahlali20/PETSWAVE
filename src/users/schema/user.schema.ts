import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string;
  @Prop({ required: true })
  lastName: string;
  @Prop({ required: false })
  avatar?: string;
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop({ enum: ['client', 'admin'], default: 'client' })
  role: string;
  @Prop()
  otp?: number;
  @Prop()
  otpExpires?: Date;
  @Prop({ default: false })
  isVerified: boolean;
}
export const UserSchema = SchemaFactory.createForClass(User);
