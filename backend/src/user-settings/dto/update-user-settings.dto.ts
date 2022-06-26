import { Type } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";
import { UserSettingsKeys } from "src/utils/types";

export class UpdateUserSettingsDto {
  @IsString()
  key: UserSettingsKeys;

  @IsNotEmpty()
  value: any;
}