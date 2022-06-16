import { IsOptional, IsString, IsUrl } from "class-validator";

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsUrl()
  avatarUrl: string;
}