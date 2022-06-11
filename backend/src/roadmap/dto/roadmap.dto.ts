import { IsUUID, ValidateNested } from "class-validator";
import { YearDto } from "./year.dto";

export class RoadmapDto {
  @IsUUID()
  courseId: string;

  @ValidateNested({ each: true })
  years: YearDto[];
}