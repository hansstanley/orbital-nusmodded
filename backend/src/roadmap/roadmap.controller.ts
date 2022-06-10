import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { RoadmapDto } from './dto';
import { RoadmapError } from './models/errors';
import { RoadmapService } from './roadmap.service';

@Controller('roadmap')
export class RoadmapController {
  constructor(
    private readonly roadmapService: RoadmapService
  ) { }

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  async validate(roadmapDto: RoadmapDto): Promise<RoadmapError[]> {
    return this.roadmapService.validate(roadmapDto);
  }
}
