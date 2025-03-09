import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

const mockCategory = {
  _id: '507f1f77bcf86cd799439011',
  name: 'Chien',
};

describe('CategoryController', () => {
  let controller: CategoryController;
  let service: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockCategory),
            findAll: jest.fn().mockResolvedValue([mockCategory]),
          },
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a category', async () => {
    const dto = { name: 'Chien' };
    const result = await controller.create(dto);
    expect(result).toEqual(mockCategory);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return all categories', async () => {
    const result = await controller.getAllCategory();
    expect(result).toEqual([mockCategory]);
    expect(service.findAll).toHaveBeenCalled();
  });
});
