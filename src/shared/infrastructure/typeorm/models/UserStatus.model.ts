import { BaseEntity, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm'

export type UserStatusModelProps = Pick<UserStatusModel, 'userStatusName'>

@Entity()
export class UserStatusModel extends BaseEntity {
  @PrimaryColumn('varchar', { length: 16 })
  userStatusName: string

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date

  static build = (props: UserStatusModelProps) => UserStatusModel.create({ ...props })
}
