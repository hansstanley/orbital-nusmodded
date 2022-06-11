import { Controller, Get, Param } from '@nestjs/common';
import { NusmodsService } from './nusmods.service';

@Controller('nusmods')
export class NusmodsController {
  constructor(
    private readonly nusmodsService: NusmodsService
  ) { }

  @Get('moduleList')
  getModuleList() {
    return this.nusmodsService.getSummaries();
  }

  @Get('moduleInfo')
  getModuleDetails() {
    return this.nusmodsService.getDetails();
  }

  @Get(':moduleCode')
  getModuleInfo(@Param('moduleCode') moduleCode: string) {
    return this.nusmodsService.getModuleInfo(moduleCode);
  }
}
