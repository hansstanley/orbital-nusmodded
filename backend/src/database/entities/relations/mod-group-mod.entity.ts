import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
  tableName: 'mod_group_mod'
})
export class ModGroupMod extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    field: 'mod_group_id'
  })
  modGroupId: string;

  @PrimaryKey
  @Column({
    field: 'module_code'
  })
  moduleCode: string;
}