import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { Course } from 'src/course/course.entity';
import { ModInfoDto } from 'src/nusmods/dto';
import { NusmodsService } from 'src/nusmods/nusmods.service';
import { REPO } from 'src/utils/constants';
import { Mod } from './mod.entity';

@Injectable()
export class ModService {
  private readonly logger = new Logger(ModService.name);

  constructor(
    @Inject(REPO.MOD)
    private modRepository: typeof Mod,
    private nusmodsService: NusmodsService
  ) {
    this.build();
  }

  async build(): Promise<void> {
    const fieldsOnUpdate = ['title'];

    const modDetails = await this.nusmodsService.getSummaries();
    const mods = modDetails
      .map((mod) => ({
        moduleCode: mod.moduleCode,
        title: mod.title
      }));

    await this.modRepository.bulkCreate(mods, {
      updateOnDuplicate: fieldsOnUpdate
    });
  }

  async find(moduleCode: string): Promise<Mod> {
    const mod = await this.modRepository
      .findByPk<Mod>(moduleCode);

    if (!mod) {
      throw new HttpException(
        `Module ${moduleCode} does not exist`,
        HttpStatus.NOT_FOUND
      );
    }

    return mod;
  }

  async findAll(): Promise<Mod[]> {
    const mods = await this.modRepository.findAll();

    return mods
  }
}
