import { IsNumber } from "class-validator";
import { Mod } from "src/mod/mod.entity";

export class SemesterDto {
  @IsNumber()
  id: 1 | 2 | 3 | 4;

  mods: Mod[];
}