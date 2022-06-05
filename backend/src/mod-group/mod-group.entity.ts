import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table
} from "sequelize-typescript";
import { Course } from "src/course/course.entity";
import { CourseModGroup } from "src/database/entities/relations";

@Table({
  tableName: 'mod_groups'
})
export class ModGroup extends Model {
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;

  @Column
  name: string;

  @Column
  description: string;

  @BelongsToMany(() => Course, () => CourseModGroup)
  courses: Course[]
}