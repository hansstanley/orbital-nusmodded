import { SemesterDataDto } from "./semester-data.dto";

export class ModDetailDto {
  moduleCode: string;
  title: string;
  description: string;
  moduleCredit: string;
  department: string;
  faculty: string;
  workload: number[] | string;
  prerequisite?: string;
  preclusion?: string;
  corequisite?: string;
  semesterData: SemesterDataDto[];
}