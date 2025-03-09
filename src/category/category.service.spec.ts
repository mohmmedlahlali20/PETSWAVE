import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './schema/cateogry.schema';

const mockCategory = {
  _id: '507f1f77bcf86cd799439011',
  name: 'Chien',
};

describe('CategoryService', () => {
  let service: CategoryService;
  let model: Model<Category>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getModelToken(Category.name),
          useValue: {
            create: jest.fn().mockResolvedValue(mockCategory), 
            find: jest.fn().mockResolvedValue([mockCategory]),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    model = module.get<Model<Category>>(getModelToken(Category.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a category', async () => {
    const createSpy = jest.spyOn(model, 'create').mockResolvedValue(mockCategory as any);
    const result = await service.create({ name: 'Chien' });

    expect(createSpy).toHaveBeenCalledWith({ name: 'Chien' });
    expect(result).toEqual(mockCategory);
  });

  it('should return an array of categories', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce([mockCategory]),
    } as any);

    const result = await service.findAll();
    expect(result).toEqual([mockCategory]);
  });

  it('should return an empty array when no categories exist', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce([]),
    } as any);

    const result = await service.findAll();
    expect(result).toEqual([]);
  });
});
