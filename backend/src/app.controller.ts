import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './utils/decorators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
