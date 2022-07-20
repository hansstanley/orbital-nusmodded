import { IsString, IsUrl } from "class-validator";

export class CreateCourseDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  department: string;

  @IsUrl()
  url: string;
}