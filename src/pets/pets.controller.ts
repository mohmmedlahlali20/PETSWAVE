import { Controller, Post, Body, UseInterceptors, UploadedFiles, Get, Param } from '@nestjs/common';
import { PetsService } from './pets.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreatePetDto } from './dto/create-pet.dto';

@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post('/create')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'images', maxCount: 5 }, 
  ], {
    storage: diskStorage({
      destination: './petsIMG', 
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
    fileFilter: (req, file, callback) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        return callback(new Error('Only image files are allowed!'), false);
      }
      callback(null, true);
    },
  }))
  async create(@Body() createPetDto: CreatePetDto, @UploadedFiles() files: { images?: Express.Multer.File[] }) {
    const imagePaths = files.images?.map(file => file.path) || [];
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

  




}
