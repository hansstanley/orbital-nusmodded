import { Inject, Injectable } from '@nestjs/common';
import { REPO } from 'src/utils/constants';
import { Profile } from './profile.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject(REPO.PROFILE)
    private profileRepository: typeof Profile
  ) { }

  async findByUsername(
    username: string,
    exclude: ('authToken' | 'createdAt' | 'updatedAt')[] = []
  ): Promise<Profile> {
    const attributes = [
      'id',
      'createdAt',
      'updatedAt',
      'username',
      'avatarUrl',
      'website',
      'authToken'
    ].filter((attr) => exclude.reduce(
      (prev, curr) => prev && curr !== attr,
      true
    ));

    return this.profileRepository.findOne({
      attributes: attributes,
      where: { username: username }
    });
  }
}
