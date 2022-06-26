import { IsString } from "class-validator";

export class UnbindModsDto {
  @IsString({ each: true })
  moduleCodes: string;
}