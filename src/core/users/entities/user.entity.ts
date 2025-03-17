import { BaseEntity } from 'src/base/entity.base';
import { Entity, Column, OneToMany, BeforeInsert, AfterLoad } from 'typeorm';
import { UserRole } from './user-role.entity';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { getMinioFullUrl } from 'src/utils/converter.util';

export enum UserProvider {
  EMAIL = 'email',
  GOOGLE = 'google',
}

@Entity({ schema: 'auth', name: 'users' })
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ length: 50, unique: true })
  username: string;

  @Column({ nullable: true })
  phone?: string;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  password?: string;

  @Column({
    type: 'enum',
    enum: UserProvider,
  })
  provider: UserProvider;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  verifySentAt?: Date;

  @Column({ nullable: true })
  lastSignedInAt?: Date;

  @OneToMany(() => UserRole, (userRole) => userRole.user, {
    onDelete: 'CASCADE',
  })
  roles: UserRole[];

  avatarUrl?: string;
  @AfterLoad()
  loadAvatarUrl() {
    if (this.avatar) this.avatarUrl = getMinioFullUrl(this.avatar);
  }

  @BeforeInsert()
  async hashPassword() {
    if (!this.password) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  removePassword() {
    this.password = undefined;
  }
}
