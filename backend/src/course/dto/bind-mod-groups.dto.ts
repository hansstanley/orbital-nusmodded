import { IsUUID } from "class-validator";

export class BindModGroupsDto {
  @IsUUID('all', { each: true })
  groupIds: string[];
}