import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards';
import { ReqUserModel } from 'src/auth/models';
import { Public } from 'src/utils/decorators';
import { UpdateProfileDto } from './dto';
import { Profile } from './profile.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request): Promise<Profile> {
    const reqUser = req.user as ReqUserModel;
    return (await this.userService.findByUsername(
      reqUser.username,
      ['authToken']
    ));
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile/edit')
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @Req() req: Request,
    @Body() updateDto: UpdateProfileDto
  ): Promise<Profile> {
    const reqUser = req.user as ReqUserModel;
    return this.userService
      .updateProfile(reqUser.id, updateDto);
  }

  @Public()
  @Get('check-username')
  async isUsernameAvailable(
    @Query('username') username: string
  ): Promise<{ isAvailable: boolean }> {
    const isAvailable = await this.userService
      .isUsernameAvailable(username);

    return { isAvailable };
  }
}
