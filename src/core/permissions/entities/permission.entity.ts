import { BaseEntity } from 'src/base/entity.base';
import { Entity, Column, Unique } from 'typeorm';

@Entity({ schema: 'auth', name: 'permissions' })
@Unique(['feature', 'action'])
export class Permission extends BaseEntity {
  @Column()
  feature: string;

  @Column()
  action: string;

  @Column({ nullable: true })
  description?: string;
}
