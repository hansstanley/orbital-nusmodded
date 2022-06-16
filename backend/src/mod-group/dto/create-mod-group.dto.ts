import { IsInt, IsOptional, IsString } from "class-validator";

export class CreateModGroupDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsInt()
  minimum?: number;

  @IsOptional()
  @IsInt()
  maximum?: number;
}