import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types, Schema as MongooseSchema } from "mongoose";



export type CommentDocument = Comments & Document

@Schema({timestamps: true})
export class Comments {
    @Prop({required: true})
    text: string

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    createdBy: Types.ObjectId;


    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Pets', required: true })
    petsId: Types.ObjectId;


    
}



export const CommentSchema = SchemaFactory.createForClass(Comments)