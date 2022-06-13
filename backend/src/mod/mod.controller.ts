import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { NusmodsService } from 'src/nusmods/nusmods.service';
import { Public } from 'src/utils/decorators';
import { Mod } from './mod.entity';
import { ModService } from './mod.service';

@Controller('module')
export class ModController {
  constructor(
    private readonly modService: ModService,
    private readonly nusmodsService: NusmodsService
  ) { }

  @Public()
  @Get()
  async findAll(): Promise<Mod[]> {
    return this.modService.findAll();
  }

  @Public()
  @Get(':moduleCode')
  async find(@Param('moduleCode') moduleCode: string) {

    return this.nusmodsService.getModuleInfo(moduleCode);
  }
}
