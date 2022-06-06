import {
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table
} from "sequelize-typescript";
import { ModGroup } from "src/mod-group/mod-group.entity";
import { Mod } from "src/mod/mod.entity";

@Table({
  tableName: 'mod_group_mod',
  underscored: true
})
export class ModGroupMod extends Model {
  @PrimaryKey
  @ForeignKey(() => ModGroup)
  @Column(DataType.UUID)
  modGroupId: string;

  @PrimaryKey
  @ForeignKey(() => Mod)
  @Column
  moduleCode: string;
}