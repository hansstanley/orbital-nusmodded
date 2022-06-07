import { IsString } from "class-validator";

export class BindModsDto {
  @IsString()
  type: string;

  @IsString({ each: true })
  moduleCodes: string[];
}