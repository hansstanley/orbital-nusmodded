import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { REPO } from 'src/utils/constants';
import { UpdateProfileDto } from './dto';
import { Profile } from './profile.entity';

const profileAttributes = [
  'id',
  'createdAt',
  'updatedAt',
  'username',
  'avatarUrl',
  'website',
  'authToken'
];

@Injectable()
export class UserService {
  constructor(
    @Inject(REPO.PROFILE)
    private profileRepository: typeof Profile
  ) { }

  async find(
    id: string,
    exclude: ('authToken' | 'createdAt' | 'updatedAt')[] = []
  ): Promise<Profile> {
    const attributes = profileAttributes
      .filter((attr) => exclude.reduce(
        (prev, curr) => prev && curr !== attr,
        true
      ));

    const profile = await this.profileRepository
      .findByPk<Profile>(id, {
        attributes: attributes
      });

    if (!profile) {
      throw new HttpException(
        `Profile ${id} does not exist`,
        HttpStatus.NOT_FOUND
      );
    }

    return profile;
  }

  async findByUsername(
    username: string,
    exclude: ('authToken' | 'createdAt' | 'updatedAt')[] = []
  ): Promise<Profile> {
    const attributes = profileAttributes
      .filter((attr) => exclude.reduce(
        (prev, curr) => prev && curr !== attr,
        true
      ));

    return this.profileRepository.findOne({
      attributes: attributes,
      where: { username: username }
    });
  }

  async isUsernameAvailable(username: string): Promise<boolean> {
    const profile = await this.profileRepository.findOne({
      where: { username: username }
    });

    return !profile;
  }

  async updateProfile(
    id: string,
    updateDto: UpdateProfileDto
  ): Promise<Profile> {
    const profile: Profile = await this.find(id, ['authToken']);


    if (updateDto.username && updateDto.username !== profile.username) {
      const isAvailable = await this.isUsernameAvailable(updateDto.username);
      if (!isAvailable) throw new HttpException(
        `${updateDto.username} has already been taken`,
        HttpStatus.BAD_REQUEST
      );
    }

    for (let key in updateDto) {
      if ((updateDto[key] ?? false) && key in profile) {
        profile[key] = updateDto[key];
      }
    }

    return profile.save();
  }
}
