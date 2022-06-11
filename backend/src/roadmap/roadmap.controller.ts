import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { RoadmapDto } from './dto';
import { RoadmapError } from './models/errors';
import { RoadmapService } from './roadmap.service';

@Controller('roadmap')
export class RoadmapController {
  constructor(
    private readonly roadmapService: RoadmapService
  ) { }

  @Post('validate/all')
  @HttpCode(HttpStatus.OK)
  async validateAll(@Body() roadmapDto: RoadmapDto): Promise<RoadmapError[]> {
    return this.roadmapService.validateAll(roadmapDto);
  }

  @Post('validate/module-availability')
  @HttpCode(HttpStatus.OK)
  async validateAvailable(@Body() roadmapDto: RoadmapDto): Promise<RoadmapError[]> {
    return this.roadmapService.validateAvailable(roadmapDto);
  }

  @Post('validate/course-requirement')
  @HttpCode(HttpStatus.OK)
  async validateCourseReq(@Body() roadmapDto: RoadmapDto): Promise<RoadmapError[]> {
    return this.roadmapService.validateCourseReq(roadmapDto);
  }

  @Post('validate/prerequisite')
  @HttpCode(HttpStatus.OK)
  async validatePrereq(@Body() roadmapDto: RoadmapDto): Promise<RoadmapError[]> {
    return this.roadmapService.validatePrereq(roadmapDto);
  }
}
