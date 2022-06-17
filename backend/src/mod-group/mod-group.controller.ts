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
import {
  BindModsDto,
  CreateModGroupDto,
  UnbindModsDto,
  UpdateModGroupDto
} from './dto';
import { ModGroup } from './mod-group.entity';
import { ModGroupService } from './mod-group.service';

@Controller('module-group')
export class ModGroupController {
  constructor(
    private readonly modGroupService: ModGroupService
  ) { }

  @Get()
  async findAll(): Promise<ModGroup[]> {
    return this.modGroupService.findAll();
  }

  @Get(':id')
  async find(@Param('id') id: string): Promise<ModGroup> {
    return this.modGroupService.find(id);
  }

  @Get(':id/modules')
  async getMods(@Param('id') id: string): Promise<Mod[]> {
    const modGroup = await this.modGroupService.find(id);
    return modGroup.$get('mods');
  }

  @Post('new')
  async create(@Body() createDto: CreateModGroupDto): Promise<ModGroup> {
    return this.modGroupService.create(createDto);
  }

  @Post(':id/edit')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateModGroupDto
  ): Promise<ModGroup> {
    return this.modGroupService.update(id, updateDto);
  }

  @Post(':id/add-modules')
  @HttpCode(HttpStatus.OK)
  async bindMods(
    @Param('id') id: string,
    @Body() bindModsDto: BindModsDto
  ): Promise<{ bound: string[] }> {
    const modGroup = await this.modGroupService.find(id);
    const codes = await this.modGroupService.bindMods(
      modGroup,
      bindModsDto
    );

    return { bound: codes };
  }

  @Post(':id/remove-modules')
  @HttpCode(HttpStatus.OK)
  async unbindMods(
    @Param('id') id: string,
    @Body() unbindModsDto: UnbindModsDto
  ): Promise<{ count: number }> {
    const modGroup = await this.modGroupService.find(id);
    const count = await this.modGroupService.unbindMods(
      modGroup,
      unbindModsDto
    );

    return { count };
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ModGroup> {
    return this.modGroupService.delete(id);
  }
}
