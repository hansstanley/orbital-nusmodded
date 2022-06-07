import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { Course } from 'src/course/course.entity';
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
    const fieldsOnUpdate = [
      'moduleCredit',
      'title',
      'department',
      'faculty',
      'prerequisite',
      'preclusion'
    ];

    const modDetails = await this.nusmodsService.getDetails();
    const mods = modDetails
      .map((mod) => ({ ...mod }));

    /**
     * TODO:
     * Finalise database shape of Mod
     * Build sync
     */

    // for (let mod of mods) {
    //   this.logger.debug(`Upserting ${mod.moduleCode}...`);
    //   try { await this.modRepository.upsert(mod); }
    //   catch (err) {
    //     console.log(mod.moduleCode, mod);
    //     console.error(err);
    //   }
    // }

    // const chunkSize = 100;
    // for (let i = 0; i < mods.length; i += chunkSize) {
    //   const chunk = mods.slice(i, i + chunkSize);
    //   await this.modRepository.bulkCreate(chunk, {
    //     updateOnDuplicate: fieldsOnUpdate
    //   });
    // }
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
}
