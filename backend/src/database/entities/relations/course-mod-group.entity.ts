import { Column, DataType, Model, Table } from "sequelize-typescript";

export enum CourseModGroupType {
  PRECLUSION = 'preclusion',
  COREQ = 'corequisite'
}

@Table({
  tableName: 'course_mod_group'
})
export class CourseModGroup extends Model {
  @Column({
    field: 'course_id',
    primaryKey: true
  })
  courseId: string;

  @Column({
    type: DataType.UUID,
    field: 'mod_group_id',
    primaryKey: true
  })
  modGroupId: string;

  @Column
  type: CourseModGroupType
}