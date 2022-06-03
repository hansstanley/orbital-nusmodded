import { PickType } from "@nestjs/mapped-types";
import { UpdateCourseDto } from "./update-course.dto";

export class DeleteCourseDto extends PickType(
  UpdateCourseDto,
  ['id']
) { }