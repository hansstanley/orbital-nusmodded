import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table
} from "sequelize-typescript";
import { Course } from "src/course/course.entity";
import { CourseModGroup, ModGroupMod } from "src/database/entities/relations";
import { Mod } from "src/mod/mod.entity";

@Table({
  tableName: 'mod_groups',
  underscored: true
})
export class ModGroup extends Model {
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;

  @Column
  name: string;

  @Column
  description: string;

  @Column(DataType.SMALLINT)
  minimum: number;

  @Column(DataType.SMALLINT)
  maximum: number;

  @Column
  global: boolean;

  @BelongsToMany(() => Course, () => CourseModGroup)
  courses: Course[];

  @BelongsToMany(() => Mod, () => ModGroupMod)
  mods: Mod[];

  fits(mods: Mod[]): boolean {
    const theseMods = this.mods?.map((mod) => mod.moduleCode) ?? [];
    const thoseMods = mods?.map((mod) => mod.moduleCode) ?? [];

    const common = theseMods.filter((mod) => thoseMods.includes(mod));

    return (this.minimum ? common.length >= this.minimum : true)
      && (this.maximum ? common.length <= this.maximum : true);
  }
}