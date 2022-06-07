import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table
} from "sequelize-typescript";
import { CourseMod, CourseModGroup } from "src/database/entities/relations";
import { ModGroup } from "src/mod-group/mod-group.entity";
import { Mod } from "src/mod/mod.entity";

@Table({
  tableName: 'courses',
  underscored: true
})
export class Course extends Model {
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;

  @Column
  name: string

  @Column
  department: string;

  @Column
  description: string;

  @BelongsToMany(() => Mod, () => CourseMod)
  mods: Mod[];

  @BelongsToMany(() => ModGroup, () => CourseModGroup)
  modGroups: ModGroup[];
}