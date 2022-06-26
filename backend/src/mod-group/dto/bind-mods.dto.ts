import { IsString } from "class-validator";

export class BindModsDto {
  @IsString({ each: true })
  moduleCodes: string[];
}