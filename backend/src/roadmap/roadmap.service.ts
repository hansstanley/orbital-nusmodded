import { Injectable, Logger } from '@nestjs/common';
import { Course } from 'src/course/course.entity';
import { CourseService } from 'src/course/course.service';
import { ModGroup } from 'src/mod-group/mod-group.entity';
import { Mod } from 'src/mod/mod.entity';
import { NusmodsService } from 'src/nusmods/nusmods.service';
import { RoadmapDto, YearDto } from './dto';
import { CourseReqError, RoadmapError } from './models/errors';

@Injectable()
export class RoadmapService {
  private readonly logger = new Logger(RoadmapService.name);

  constructor(
    private readonly courseService: CourseService,
    private readonly nusmodsService: NusmodsService
  ) { }

  private sortByTerm(roadmapDto: RoadmapDto): RoadmapDto {
    roadmapDto.years?.sort((y1, y2) => y1.id - y2.id);
    for (let year of roadmapDto.years ?? []) {
      year.semesters?.sort((s1, s2) => s1.id - s2.id);
    }
    return roadmapDto;
  }

  async validateAll(roadmapDto: RoadmapDto): Promise<RoadmapError[]> {
    let errors: RoadmapError[] = [];

    if (!(roadmapDto ?? false)) return errors;
    this.sortByTerm(roadmapDto);

    errors = (await Promise.all([
      this.validateAvailable(roadmapDto),
      this.validateCourseReq(roadmapDto),
      this.validatePrereq(roadmapDto)
    ])).reduce((prev, curr) => prev.concat(curr));

    return errors;
  }

  async validateAvailable(roadmapDto: RoadmapDto): Promise<RoadmapError[]> {
    return [];
  }

  async validateCourseReq(roadmapDto: RoadmapDto): Promise<RoadmapError[]> {
    let errors: RoadmapError[] = [];

    if (!(roadmapDto ?? false)) return errors;

    const course = await this.courseService.find(roadmapDto.courseId);
    [course.mods, course.modGroups] = await Promise.all([
      course.$get('mods'),
      course.$get('modGroups')
    ]);

    let roadmapMods: Mod[] = [];
    for (let year of roadmapDto.years ?? []) {
      for (let semester of year.semesters ?? []) {
        roadmapMods = roadmapMods.concat(semester?.mods);
      }
    }

    for (let mod of course.mods ?? []) {
      const hasMod = roadmapMods
        .map((mod) => mod.moduleCode)
        .includes(mod.moduleCode);

      if (!hasMod) errors.push(new CourseReqError(mod, course));
    }

    for (let modGroup of course.modGroups ?? []) {
      if (!modGroup.fits(roadmapMods)) {
        errors.push(new CourseReqError(modGroup, course));
      }
    }

    return errors;
  }

  async validatePrereq(roadmapDto: RoadmapDto): Promise<RoadmapError[]> {
    this.sortByTerm(roadmapDto);

    return [];
  }
}
