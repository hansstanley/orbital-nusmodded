import { HttpException, Injectable, Logger } from '@nestjs/common';
import { isArray } from 'class-validator';
import { Course } from 'src/course/course.entity';
import { CourseService } from 'src/course/course.service';
import { ModGroup } from 'src/mod-group/mod-group.entity';
import { Mod } from 'src/mod/mod.entity';
import { ModService } from 'src/mod/mod.service';
import { ModInfoDto, PrereqTree } from 'src/nusmods/dto';
import { NusmodsService } from 'src/nusmods/nusmods.service';
import { RoadmapDto, YearDto } from './dto';
import { CourseReqError, NotAvailableError, PrerequisiteError, RoadmapError } from './models/errors';

@Injectable()
export class RoadmapService {
  private readonly logger = new Logger(RoadmapService.name);

  constructor(
    private readonly courseService: CourseService,
    private readonly modService: ModService,
    private readonly nusmodsService: NusmodsService
  ) { }

  private sortByTerm(roadmapDto: RoadmapDto): RoadmapDto {
    roadmapDto.years?.sort((y1, y2) => y1.id - y2.id);
    for (let year of roadmapDto.years ?? []) {
      year.semesters?.sort((s1, s2) => s1.id - s2.id);
    }
    return roadmapDto;
  }

  private getRoadmapModuleCodes(roadmapDto: RoadmapDto): string[] {
    let roadmapMods: string[] = [];
    for (let year of roadmapDto.years ?? []) {
      for (let semester of year.semesters ?? []) {
        roadmapMods = roadmapMods.concat(semester?.moduleCodes ?? []);
      }
    }
    return roadmapMods;
  }

  private checkPrereq(
    prereqTree: string | PrereqTree,
    moduleCodes: string[],
    missing: (string | string[])[]
  ): void {
    if (typeof prereqTree === 'string') {
      if (!moduleCodes.includes(prereqTree)) {
        missing.push(prereqTree);
      }
    } else if (prereqTree?.and) {
      for (let nextTree of prereqTree.and) {
        this.checkPrereq(nextTree, moduleCodes, missing);
      }
    } else if (prereqTree?.or) {
      const passed: boolean = prereqTree.or.reduce(
        (prev, curr) => prev || moduleCodes.includes(curr),
        false
      );
      if (!passed) missing.push(prereqTree.or);
    }
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
    let errors: RoadmapError[] = [];

    if (!(roadmapDto ?? false)) return errors;

    for (let year of roadmapDto.years ?? []) {
      for (let semester of year.semesters ?? []) {
        for (let code of semester.moduleCodes ?? []) {
          const { semesterData } = await this.nusmodsService
            .getModuleInfo(code);
          const isAvailable = (semesterData ?? [])
            .map((sem) => sem.semester)
            .includes(semester.id);

          if (!isAvailable) errors.push(new NotAvailableError(
            (await this.modService.find(code)),
            semester
          ));
        }
      }
    }

    return errors;
  }

  async validateCourseReq(roadmapDto: RoadmapDto): Promise<RoadmapError[]> {
    let errors: RoadmapError[] = [];

    if (!(roadmapDto ?? false)) return errors;

    const course = await this.courseService.find(roadmapDto.courseId);
    [course.mods, course.modGroups] = await Promise.all([
      course.$get('mods'),
      course.$get('modGroups')
    ]);

    const moduleCodes = this.getRoadmapModuleCodes(roadmapDto);

    for (let mod of course.mods ?? []) {
      const hasMod = moduleCodes.includes(mod.moduleCode);

      if (!hasMod) errors.push(new CourseReqError(mod, course));
    }

    const roadmapMods = await Promise
      .all(moduleCodes.map((code) => this.modService.find(code)));

    for (let modGroup of course.modGroups ?? []) {
      if (!modGroup.fits(roadmapMods)) {
        errors.push(new CourseReqError(modGroup, course));
      }
    }

    return errors;
  }

  async validatePrereq(roadmapDto: RoadmapDto): Promise<RoadmapError[]> {
    let errors: RoadmapError[] = [];

    if (!(roadmapDto ?? false)) return errors;

    const modInfo = new Map<string, ModInfoDto>();
    const infos = await Promise.all(this.getRoadmapModuleCodes(roadmapDto)
      .map((code) => this.nusmodsService.getModuleInfo(code)));
    for (let info of infos) {
      modInfo.set(info.moduleCode, info);
    }

    this.sortByTerm(roadmapDto);
    let checked: string[] = [];

    for (let year of roadmapDto.years ?? []) {
      for (let semester of year?.semesters ?? []) {
        const moduleCodes = semester?.moduleCodes ?? [];
        for (let code of moduleCodes) {
          const { prereqTree } = modInfo.get(code);
          if (!prereqTree) continue;
          const target = await this.modService.find(code);

          const missing: (string | string[])[] = [];
          this.checkPrereq(prereqTree, checked, missing);

          const { ands, ors }: {
            ands: string[],
            ors: string[][]
          } = missing.reduce(
            (prev, curr) => {
              if (typeof curr === 'string') {
                prev.ands.push(curr);
              } else if (isArray(curr)) {
                prev.ors.push(curr);
              }
              return prev;
            },
            { ands: [], ors: [] }
          );

          if (ands.length) {
            errors.push(new PrerequisiteError(target, ands, 'and'));
          }
          if (ors.length) {
            for (let or of ors) {
              errors.push(new PrerequisiteError(target, or, 'or'));
            }
          }
        }
        checked = checked.concat(moduleCodes);
      }
    }

    return errors;
  }
}
