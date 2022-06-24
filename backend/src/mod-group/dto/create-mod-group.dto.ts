import { IsBoolean, IsInt, IsOptional, IsString } from "class-validator";

export class CreateModGroupDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  minimum?: number;

  @IsOptional()
  @IsInt()
  maximum?: number;

  @IsBoolean()
  global: boolean;
}