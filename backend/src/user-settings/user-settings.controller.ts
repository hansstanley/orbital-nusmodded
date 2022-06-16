import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';
import { isBoolean, isInt, isUUID } from 'class-validator';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards';
import { ReqUserModel } from 'src/auth/models';
import { UpdateUserSettingsDto } from './dto';
import { UserSettings } from './user-settings.entity';
import { UserSettingsService } from './user-settings.service';

@Controller('user-settings')
export class UserSettingsController {
  constructor(
    private readonly userSettingsService: UserSettingsService
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getSettings(@Req() req: Request) {
    const reqUser = req.user as ReqUserModel;

    return this.userSettingsService
      .getSettings(reqUser.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('edit')
  @HttpCode(HttpStatus.OK)
  async setSettings(
    @Req() req: Request,
    @Body() updateDto: UpdateUserSettingsDto
  ): Promise<UserSettings> {
    const { id } = req.user as ReqUserModel;
    const { key, value } = updateDto;

    switch (key) {
      case 'COURSE_ID':
        if (isUUID(value)) {
          return this.userSettingsService.setCourseId(id, value);
        }
        break;
      case 'IS_HONORS':
        if (isBoolean(value)) {
          return this.userSettingsService.setHonors(id, value);
        }
        break;
      case 'MC_LIMIT':
        if (isInt(value)) {
          return this.userSettingsService.setModuleCreditLimit(id, value);
        }
        break;
    }

    throw new HttpException(
      `Invalid key-value pair for user settings: (${key}, ${value})`,
      HttpStatus.BAD_REQUEST
    );
  }
}
