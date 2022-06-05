import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table
} from "sequelize-typescript";
import { Course } from "src/course/course.entity";
import { CourseMod, ModGroupMod } from "src/database/entities/relations";
import { ModGroup } from "src/mod-group/mod-group.entity";

@Table({
  tableName: 'mods',
  underscored: true
})
export class Mod extends Model {
  @PrimaryKey
  @Column
  moduleCode: string;

  @Column(DataType.SMALLINT)
  moduleCredit: number;

  @Column
  title: string;

  @Column
  department: string;

  @Column
  faculty: string;

  @Column
  prerequisite: string;

  @Column
  preclusion: string

  @BelongsToMany(() => Course, () => CourseMod)
  courses: Course[];

  @BelongsToMany(() => ModGroup, () => ModGroupMod)
  modGroups: ModGroup[]
}