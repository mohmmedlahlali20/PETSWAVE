import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  Get,
  Param,
  Delete,
  Patch,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { PetsService } from './pets.service';
import {
  FileFieldsInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';

import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { MinioService } from 'src/minio/minio.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/common/Role.decrotor';

@Controller('pets')
@UseGuards(JwtAuthGuard)
export class PetsController {
  constructor(
    private readonly petsService: PetsService,
    private readonly minioService: MinioService,
  ) {}

  @Post('/create')
  @Roles('Admin')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 8 }]))
  async create(
    @Body() createPetDto: CreatePetDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    const bucketName = 'pets-bucket';
    const imagePaths = [];

    for (const file of files.images || []) {
      const fileName = await this.minioService.uploadFile(bucketName, file);
      console.log(fileName);

      imagePaths.push(`http://127.0.0.1:9000/${bucketName}/${fileName}`);
    }

    return this.petsService.create(createPetDto, imagePaths);
  }

  @Get('/findAll')
  async findAllPets() {
    return this.petsService.getAllPets();
  }

  @Get('/findAllForAdmin')
  @Roles('admin')
  async findAllPetsForAdmin() {
    return this.petsService.getAllPetsForAdmin();
  }

  @Get('/findByPetsId/:id')
  async findByPetsId(@Param('id') id: string) {
    const pet = await this.petsService.getPetsById(id);
    if (!pet) {
      throw new NotFoundException(`Pet with ID ${id} not found`);
    }
    return pet;
  }

  @Get('/getPetsByCategoryID/:categoryId')
  async getPetsByCategoryId(@Param('categoryId') categoryId: string) {
    return this.petsService.getPetsByCategoryID(categoryId);
  }

  @Delete('/delete/:petsId')
  async deletePets(@Param('petsId') petsId: string) {
    return this.petsService.removePets(petsId);
  }

  @Patch('/update/:petsId')
  @UseInterceptors(FilesInterceptor('images'))
  async updatePets(
    @Param('petsId') petsId: string,
    @Body() updateDTO: UpdatePetDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<any> {
    try {
      const imagePaths = files?.map((file) => file.path) || [];

      const existingPet = await this.petsService.getPetsById(petsId);

      if (!existingPet) {
        return { message: 'Pet not found' };
      }

      const updatedImages = [...existingPet.images, ...imagePaths];

      const updatedPet = await this.petsService.update(petsId, {
        ...updateDTO,
        images: updatedImages,
      });

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
