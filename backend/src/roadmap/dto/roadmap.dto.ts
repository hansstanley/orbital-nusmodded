import { Type } from "class-transformer";
import { IsUUID, ValidateNested } from "class-validator";
import { YearDto } from "./year.dto";

export class RoadmapDto {
  @IsUUID()
  courseId: string;

  @ValidateNested({ each: true })
  @Type(() => YearDto)
  years: YearDto[];
}