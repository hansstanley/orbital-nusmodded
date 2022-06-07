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
import { ModGroup } from 'src/mod-group/mod-group.entity';
import { Mod } from 'src/mod/mod.entity';
import { CourseService } from './course.service';
import { BindModsDto, CreateCourseDto, UnbindModsDto } from './dto';
import { CourseDto } from './dto/course.dto';

@Controller('course')
export class CourseController {
  constructor(
    private readonly courseService: CourseService
  ) { }

  @Get()
  findAll(): Promise<CourseDto[]> {
    return this.courseService.findAll();
  }

  @Get(':id')
  find(@Param('id') id: string): Promise<CourseDto> {
    return this.courseService.find(id);
  }

  @Get(':id/modules')
  async getMods(@Param('id') id: string): Promise<Mod[]> {
    const course = await this.courseService.find(id);
    return course.$get('mods');
  }

  @Get(':id/module-groups')
  async getModGroups(@Param('id') id: string): Promise<ModGroup[]> {
    const course = await this.courseService.find(id);
    return course.$get('modGroups');
  }

  @Post('new')
  create(@Body() createDto: CreateCourseDto): Promise<CourseDto> {
    return this.courseService.create(createDto);
  }

  @Post(':id/add-modules')
  @HttpCode(HttpStatus.OK)
  async bindMods(
    @Param('id') id: string,
    @Body() bindModsDto: BindModsDto
  ): Promise<{ bound: string[] }> {
    const course = await this.courseService.find(id);

    const codes = await this.courseService.bindMods(course, bindModsDto);

    return { bound: codes };
  }

  @Post(':id/remove-modules')
  @HttpCode(HttpStatus.OK)
  async unbindMods(
    @Param('id') id: string,
    @Body() unbindModsDto: UnbindModsDto
  ): Promise<{ count: number }> {
    const course = await this.courseService.find(id);

    const count = await this.courseService.unbindMods(
      course,
      unbindModsDto
    );

    return { count };
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<CourseDto> {
    return this.courseService.delete(id);
  }
}
