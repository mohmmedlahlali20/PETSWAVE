import { Controller, Post, Body, UseInterceptors, UploadedFiles, Get, Param, Delete, Patch } from '@nestjs/common';
import { PetsService } from './pets.service';
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';

import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { MinioService } from 'src/minio/minio.service';

@Controller('pets')
export class PetsController {
  minioService: MinioService;
  constructor(private readonly petsService: PetsService) {}

  @Post('/create')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 5 }]))
  async create(
    @Body() createPetDto: CreatePetDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] }
  ) {
    const bucketName = 'pets-images';
    const imagePaths = [];

    for (const file of files.images || []) {
      const fileName = await this.minioService.uploadFile(bucketName, file);
      imagePaths.push(`http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${bucketName}/${fileName}`);
    }

    return this.petsService.create(createPetDto, imagePaths);
  }


  @Get('/findAll')
  async findAllPets(){
    return this.petsService.getAllPets()
  }

  @Get('/findByPetsId/:petsId')
  async findByPetsId(@Param('petsId')  petsId: string){
    return this.petsService.getPetsById(petsId)
  }


  @Get('/getPetsByCategoryID/:categoryId')
  async getPetsByCategoryId(@Param('categoryId')  categoryId:string ){
    return this.petsService.getPetsByCategoryID(categoryId)
  }

  @Delete('/delete/:petsId')
  async deletePets(@Param('petsId') petsId: string){
    return this.petsService.removePets(petsId)
  }

  @Patch('/update/:petsId')
@UseInterceptors(FilesInterceptor('images'))
async updatePets(
  @Param('petsId') petsId: string,
  @Body() updateDTO: UpdatePetDto,
  @UploadedFiles() files: Express.Multer.File[],
): Promise<any> {
  try {
    const imagePaths = files?.map(file => file.path) || [];

    const existingPet = await this.petsService.getPetsById(petsId);

    if (!existingPet) {
      return { message: 'Pet not found' };
    }

    const updatedImages = [...existingPet.images, ...imagePaths];

    const updatedPet = await this.petsService.update(petsId, { ...updateDTO, images: updatedImages });

    return {
      message: 'Pet updated successfully',
      updatedPet,
    };
  } catch (error) {
    console.error('Error while updating pet:', error);
    throw new Error('Failed to update pet');
  }
}





  




}
