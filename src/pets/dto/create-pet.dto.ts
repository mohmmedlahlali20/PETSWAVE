import { IsString, IsNotEmpty, IsNumber, IsEnum, IsArray, ArrayNotEmpty, IsMongoId, IsBoolean } from 'class-validator';

export class CreatePetDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(['Male', 'Female'])
  gender: string;

  @IsNotEmpty()
  @IsNumber()
  age: number;


  @IsNotEmpty()
  @IsMongoId()
  category: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  images: string[];

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  Prix: number

  @IsNotEmpty()
  @IsBoolean()
  isAvailable: boolean
}
