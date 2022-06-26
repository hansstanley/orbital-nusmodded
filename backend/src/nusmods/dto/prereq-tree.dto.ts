import { Type } from "class-transformer";

export class PrereqTree {
  @Type(() => PrereqTree)
  and?: (string | PrereqTree)[];

  or?: string[];
}