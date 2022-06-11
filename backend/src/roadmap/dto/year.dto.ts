import { IsNumber, ValidateNested } from "class-validator";
import { SemesterDto } from "./semester.dto";

export class YearDto {
  @IsNumber()
  id: number;

  @ValidateNested({ each: true })
  semesters: SemesterDto[];
}