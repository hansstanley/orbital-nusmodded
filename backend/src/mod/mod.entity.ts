import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table
} from "sequelize-typescript";

@Table({
  tableName: 'mods'
})
export class Mod extends Model {
  @PrimaryKey
  @Column({
    field: 'module_code'
  })
  moduleCode: string;

  @Column({
    type: DataType.SMALLINT,
    field: 'module_credit'
  })
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
}