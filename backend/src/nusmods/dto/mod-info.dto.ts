import { Type } from "class-transformer";
import { PrereqTree } from "./prereq-tree.dto";
import { SemesterDataDto } from "./semester-data.dto";

export class ModInfoDto {
  acadYear: string;
  preclusion?: string;
  description: string;
  title: string;
  department: string;
  faculty: string;
  workload: number[] | string;
  prerequisite?: string;
  moduleCredit: string;
  moduleCode: string;

  @Type(() => SemesterDataDto)
  semesterData: SemesterDataDto[];

  @Type(() => PrereqTree)
  prereqTree?: string | PrereqTree;

  fulfillRequirements?: string[];
}