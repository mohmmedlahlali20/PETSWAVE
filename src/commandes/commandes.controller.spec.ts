import { Test, TestingModule } from '@nestjs/testing';
import { CommandesController } from './commandes.controller';
import { CommandesService } from './commandes.service';

describe('CommandesController', () => {
  let controller: CommandesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommandesController],
      providers: [CommandesService],
    }).compile();

    controller = module.get<CommandesController>(CommandesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
