import { Column, DataType, Model, Table } from "sequelize-typescript";

export enum CourseModType {
  CORE = 'core',
  GE = 'ge',
  UE = 'ue'
}

@Table({
  tableName: 'course_mod'
})
export class CourseMod extends Model {
  @Column({
    type: DataType.UUID,
    field: 'course_id',
    primaryKey: true
  })
  courseId: string;

  @Column({
    field: 'module_code',
    primaryKey: true
  })
  moduleCode: string;

  @Column
  type: CourseModType
}