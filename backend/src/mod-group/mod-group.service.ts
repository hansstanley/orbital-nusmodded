import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { Mod } from 'src/mod/mod.entity';
import { ModService } from 'src/mod/mod.service';
import { REPO } from 'src/utils/constants';
import { v4 as uuidv4 } from 'uuid';
import { BindModsDto, CreateModGroupDto, UnbindModsDto, UpdateModGroupDto } from './dto';
import { ModGroup } from './mod-group.entity';

@Injectable()
export class ModGroupService {
  private readonly logger = new Logger(ModGroupService.name);

  constructor(
    @Inject(REPO.MOD_GROUP)
    private modGroupRepository: typeof ModGroup,
    private readonly modService: ModService
  ) { }

  async findAll(): Promise<ModGroup[]> {
    return this.modGroupRepository.findAll<ModGroup>();
  }

  async find(id: string): Promise<ModGroup> {
    const modGroup = await this.modGroupRepository
      .findByPk<ModGroup>(id);

    if (!modGroup) {
      throw new HttpException(
        `Module group ${id} does not exist`,
        HttpStatus.NOT_FOUND
      );
    }

    return modGroup;
  }

  async create(createDto: CreateModGroupDto): Promise<ModGroup> {
    const modGroup = new ModGroup();
    modGroup.id = uuidv4();

    for (let key in createDto) {
      if ((createDto[key] ?? false) && key in modGroup) {
        modGroup[key] = createDto[key];
      }
    }

    return modGroup.save();
  }

  async update(id: string, updateDto: UpdateModGroupDto): Promise<ModGroup> {
    const modGroup: ModGroup = await this.find(id);

    for (let key in updateDto) {
      if ((updateDto[key] ?? false) && key in modGroup) {
        modGroup[key] = updateDto[key];
      }
    }

    return modGroup.save();
  }

  async delete(id: string): Promise<ModGroup> {
    const modGroup = await this.find(id);
    await modGroup.destroy();
    return modGroup;
  }

  async bindMods(
    modGroup: ModGroup,
    bindModsDto: BindModsDto
  ): Promise<string[]> {
    const { moduleCodes } = bindModsDto;

    const mods: Mod[] = await Promise.all(moduleCodes
      .map((code) => this.modService.find(code)));

    const passed: string[] = await Promise.all(mods
      .filter((mod) => mod ?? false)
      .map(async (mod) => {
        await modGroup.$add('mod', mod);
        return mod.moduleCode;
      }));

    return passed;
  }

  async unbindMods(
    modGroup: ModGroup,
    unbindModsDto: UnbindModsDto
  ): Promise<number> {
    const { moduleCodes } = unbindModsDto;

    const count = await modGroup.$remove('mod', moduleCodes);
    return count;
  }
}
