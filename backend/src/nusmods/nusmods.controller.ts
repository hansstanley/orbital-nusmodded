import { Controller, Get, Param } from '@nestjs/common';
import { Public } from 'src/utils/decorators';
import { NusmodsService } from './nusmods.service';

@Controller('nusmods')
export class NusmodsController {
  constructor(
    private readonly nusmodsService: NusmodsService
  ) { }

  @Public()
  @Get('moduleList')
  getModuleList() {
    return this.nusmodsService.getSummaries();
  }

  @Public()
  @Get('moduleInfo')
  getModuleDetails() {
    return this.nusmodsService.getDetails();
  }

  @Public()
  @Get(':moduleCode')
  getModuleInfo(@Param('moduleCode') moduleCode: string) {
    return this.nusmodsService.getModuleInfo(moduleCode);
  }
}
