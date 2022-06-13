import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post
} from '@nestjs/common';
import { Mod } from 'src/mod/mod.entity';
import { ModGroup } from './mod-group.entity';
import { ModGroupService } from './mod-group.service';

@Controller('module-group')
export class ModGroupController {
  constructor(
    private readonly modGroupService: ModGroupService
  ) { }

  @Get()
  async findAll(): Promise<ModGroup[]> {
    return
  }

  @Get(':id')
  async find(@Param('id') id: string): Promise<ModGroup> {
    return
  }

  @Get(':id/modules')
  async getMods(@Param('id') id: string): Promise<Mod[]> {
    return
  }

  @Post('new')
  async create(@Body() createDto): Promise<ModGroup> {
    return
  }

  @Post(':id/edit')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() udpateDto
  ): Promise<ModGroup> {
    return
  }

  @Post(':id/add-modules')
  @HttpCode(HttpStatus.OK)
  async bindMods(
    @Param('id') id: string,
    @Body() bindModsDto
  ): Promise<{ bound: string[] }> {
    return
  }

  @Post(':id/remove-modules')
  @HttpCode(HttpStatus.OK)
  async unbindMods(
    @Param('id') id: string,
    @Body() unbindModsDto
  ): Promise<{ count: number }> {
    return
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ModGroup> {
    return
  }
}
