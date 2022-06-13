import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards';
import { ReqUserModel } from 'src/auth/models';
import { Profile } from './profile.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req): Promise<Profile> {
    const reqUser = req.user as ReqUserModel;
    return (await this.userService.findByUsername(
      reqUser.username,
      ['authToken']
    ));
  }
}
