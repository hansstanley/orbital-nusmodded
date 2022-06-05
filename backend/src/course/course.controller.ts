import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto';
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
  async getMods(@Param('id') id: string): Promise<any> {
    const course = await this.courseService.find(id);
    return course.mods;
  }

  @Post('new')
  create(@Body() createDto: CreateCourseDto): Promise<CourseDto> {
    return this.courseService.create(createDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<CourseDto> {
    return this.courseService.delete(id);
  }
}
