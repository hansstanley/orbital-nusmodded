import { Injectable, Logger } from '@nestjs/common';
import { NusmodsService } from 'src/nusmods/nusmods.service';
import { RoadmapDto, YearDto } from './dto';
import { RoadmapError } from './models/errors';

@Injectable()
export class RoadmapService {
  private readonly logger = new Logger(RoadmapService.name);

  constructor(
    private readonly nusmodsService: NusmodsService
  ) { }

  async validate(roadmapDto: RoadmapDto): Promise<RoadmapError[]> {
    let errors: RoadmapError[] = [];

    roadmapDto.years.sort((y1, y2) => y1.id - y2.id);

    for (let year of roadmapDto.years) {
      year.semesters.sort((s1, s2) => s1.id - s2.id);
    }

    return errors;
  }
}
