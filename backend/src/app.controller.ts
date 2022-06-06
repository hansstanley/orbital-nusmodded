import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { NusmodsService } from './nusmods/nusmods.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly nusmodsService: NusmodsService
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('moduleList')
  getModuleList() {
    return this.nusmodsService.getSummaries();
  }

  @Get('moduleInfo')
  getModuleDetails() {
    return this.nusmodsService.getDetails();
  }

  @Get('/modules/:moduleCode')
  getModuleInfo(@Param('moduleCode') moduleCode: string) {
    return this.nusmodsService.getModuleInfo(moduleCode);
  }
}
