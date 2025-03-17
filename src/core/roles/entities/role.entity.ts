import { BaseEntity } from 'src/base/entity.base';
import { Permission } from 'src/core/permissions/entities/permission.entity';
import { UserRole } from 'src/core/users/entities/user-role.entity';
import { Entity, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';

@Entity({ schema: 'auth', name: 'roles' })
export class Role extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: false })
  isActive: boolean;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  users: UserRole[];

  @ManyToMany(() => Permission)
  @JoinTable()
  permissions: Permission[];
}
