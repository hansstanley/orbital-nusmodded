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
import { Public } from 'src/utils/decorators';
import { Course } from './course.entity';
import { CourseService } from './course.service';
import { BindModGroupsDto, BindModsDto, CreateCourseDto, UnbindModGroupsDto, UnbindModsDto, UpdateCourseDto } from './dto';

@Controller('course')
export class CourseController {
  constructor(
    private readonly courseService: CourseService
  ) { }

  @Public()
  @Get()
  async findAll(): Promise<Course[]> {
    return this.courseService.findAll();
  }

  @Public()
  @Get(':id')
  async find(@Param('id') id: string): Promise<Course> {
    return this.courseService.find(id);
  }

  @Public()
  @Get(':id/modules')
  async getMods(@Param('id') id: string): Promise<Mod[]> {
    const course = await this.courseService.find(id);
    return course.$get('mods');
  }

  @Public()
  @Get(':id/module-groups')
  async getModGroups(@Param('id') id: string): Promise<ModGroup[]> {
    const course = await this.courseService.find(id);
    return course.$get('modGroups');
  }

  @Post('new')
  async create(@Body() createDto: CreateCourseDto): Promise<Course> {
    return this.courseService.create(createDto);
  }

  @Post(':id/edit')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateCourseDto
  ): Promise<Course> {
    const course = await this.courseService.update(id, updateDto);

    return course;
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

  @Post(':id/add-module-groups')
  @HttpCode(HttpStatus.OK)
  async bindModGroups(
    @Param('id') id: string,
    @Body() bindModGroupsDto: BindModGroupsDto
  ): Promise<{ bound: string[] }> {
    const course = await this.courseService.find(id);

    const ids = await this.courseService.bindModGroups(
      course,
      bindModGroupsDto
    );

    return { bound: ids };
  }

  @Post(':id/remove-module-groups')
  @HttpCode(HttpStatus.OK)
  async unbindModGroups(
    @Param('id') id: string,
    @Body() unbindModGroupsDto: UnbindModGroupsDto
  ): Promise<{ count: number }> {
    const course = await this.courseService.find(id);

    const count = await this.courseService.unbindModGroups(
      course,
      unbindModGroupsDto
    );

    return { count }
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Course> {
    return this.courseService.delete(id);
  }
}
