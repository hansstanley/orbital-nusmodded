import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table
} from "sequelize-typescript";
import { Profile } from "src/user/profile.entity";
import { UserSettingsKeys } from "src/utils/types";

@Table({
  tableName: 'user_settings',
  underscored: true
})
export class UserSettings extends Model {
  @PrimaryKey
  @Column
  key: UserSettingsKeys;

  @Column
  value: string;

  @PrimaryKey
  @ForeignKey(() => Profile)
  @Column(DataType.UUID)
  profileId: string;

  @BelongsTo(() => Profile)
  profile: Profile;
}