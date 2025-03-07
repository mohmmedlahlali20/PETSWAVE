import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class CreateCommentDto {
    @IsNotEmpty()
    @IsString()
    text:string


    @IsMongoId()
    @IsNotEmpty()
    petsId: string



    @IsMongoId()
    @IsNotEmpty()
    createdBy: string
}
