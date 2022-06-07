import {
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table
} from "sequelize-typescript";
import { Course } from "src/course/course.entity";
import { Mod } from "src/mod/mod.entity";

export enum CourseModType {
  CORE = 'core',
  GE = 'ge',
  UE = 'ue'
}

@Table({
  tableName: 'course_mod',
  underscored: true
})
export class CourseMod extends Model {
  @PrimaryKey
  @ForeignKey(() => Course)
  @Column(DataType.UUID)
  courseId: string;

  @PrimaryKey
  @ForeignKey(() => Mod)
  @Column
  moduleCode: string;

  @Column
  type: CourseModType
}