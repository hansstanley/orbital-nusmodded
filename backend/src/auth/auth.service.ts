import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { randomBytes } from 'crypto';
import { Profile } from 'src/user/profile.entity';
import { UserService } from 'src/user/user.service';
import { JwtPayloadModel } from './models';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) { }

  async validateUser(username: string, hash: string): Promise<any> {
    const profile = await this.userService.findByUsername(username);

    if (profile && compareSync(profile.authToken, hash)) {
      profile.authToken = randomBytes(16).toString('hex');
      await profile.save();

      const {
        id,
        username
      } = profile;
      return {
        id,
        username
      };
    }

    return null;
  }

  async login(user: Profile) {
    const payload = new JwtPayloadModel({
      sub: user.id,
      username: user.username
    });

    return {
      accessToken: this.jwtService.sign({ ...payload })
    };
  }
}
