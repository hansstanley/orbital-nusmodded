import { IsUUID } from "class-validator";

export class UnbindModGroupsDto {
  @IsUUID('all', { each: true })
  groupIds: string[];
}