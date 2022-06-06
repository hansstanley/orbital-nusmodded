import {
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table
} from "sequelize-typescript";
import { Course } from "src/course/course.entity";
import { ModGroup } from "src/mod-group/mod-group.entity";

export enum CourseModGroupType {
  PRECLUSION = 'preclusion',
  COREQ = 'corequisite'
}

@Table({
  tableName: 'course_mod_group',
  underscored: true
})
export class CourseModGroup extends Model {
  @PrimaryKey
  @ForeignKey(() => Course)
  @Column
  courseId: string;

  @PrimaryKey
  @ForeignKey(() => ModGroup)
  @Column(DataType.UUID)
  modGroupId: string;

  @Column
  type: CourseModGroupType
}