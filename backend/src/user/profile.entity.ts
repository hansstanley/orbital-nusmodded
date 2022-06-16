import { Column, DataType, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { UserSettings } from "src/user-settings/user-settings.entity";

@Table({
  tableName: 'profiles',
  underscored: true
})
export class Profile extends Model {
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;

  @Column(DataType.TEXT)
  username: string;

  @Column(DataType.TEXT)
  avatarUrl: string;

  @Column(DataType.TEXT)
  authToken: string;

  @HasMany(() => UserSettings)
  settings: UserSettings[];
}