import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { NusmodsService } from 'src/nusmods/nusmods.service';
import { Mod } from './mod.entity';
import { ModService } from './mod.service';

@Controller('module')
export class ModController {
  constructor(
    private readonly modService: ModService,
    private readonly nusmodsService: NusmodsService
  ) { }

  @Get()
  async findAll(): Promise<Mod[]> {
    return this.modService.findAll();
  }

  @Get(':moduleCode')
  find(@Param('moduleCode') moduleCode: string) {
    return this.nusmodsService.getModuleInfo(moduleCode);
  }
}
