import { IsNumber } from "class-validator";
import { SemesterDto } from "./semester.dto";

export class YearDto {
  @IsNumber()
  id: number;

  semesters: SemesterDto[];
}