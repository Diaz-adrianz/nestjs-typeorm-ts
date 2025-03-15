import {
  Entity,
  ManyToOne,
  Unique,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Role } from 'src/core/roles/entities/role.entity';

@Entity({ schema: 'auth', name: 'user_roles' })
@Unique(['user', 'role'])
export class UserRole {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User, (user) => user.roles)
  user: User;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  @Column({ default: false })
  isActive: Boolean;
}
