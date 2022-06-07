import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ModService } from './mod.service';

@Controller('module')
export class ModController {
  constructor(
    private readonly modService: ModService
  ) { }

  @Get(':moduleCode')
  find(@Param('moduleCode') moduleCode: string) {
    return this.modService.find(moduleCode);
  }
}
