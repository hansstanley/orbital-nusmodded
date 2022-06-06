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
  semesterData: SemesterDataDto;
  prereqTree?: string | PrereqTree;
  fulfillRequirements?: string[];
}