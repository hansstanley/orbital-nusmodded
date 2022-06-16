import { PartialType } from "@nestjs/mapped-types";
import { CreateModGroupDto } from "./create-mod-group.dto";

export class UpdateModGroupDto extends PartialType(CreateModGroupDto) { }