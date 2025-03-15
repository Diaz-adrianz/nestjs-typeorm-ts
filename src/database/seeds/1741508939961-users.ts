import { User, UserProvider } from 'src/core/users/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { genSalt, hash } from 'bcrypt';

export class Users1741508939961 implements Seeder {
  track = false;

  // @ts-ignore
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const salt = await genSalt(10);

    const repo = dataSource.getRepository(User);
    const result = await repo
      .createQueryBuilder()
      .insert()
      .values([
        {
          email: 'superadmin@example.com',
          username: 'superadmin',
          provider: UserProvider.EMAIL,
          password: await hash('passsuperadmin', salt),
          isActive: true,
          isVerified: true,
        },
        {
          email: 'admin@example.com',
          username: 'admin',
          provider: UserProvider.EMAIL,
          password: await hash('passadmin', salt),
          isActive: true,
          isVerified: true,
        },
        {
          email: 'user@example.com',
          username: 'user',
          provider: UserProvider.EMAIL,
          password: await hash('passuser', salt),
          isActive: true,
          isVerified: true,
        },
      ])
      .orIgnore()
      .execute();

    console.log('DONE: users seeder %d inserted', result.raw?.length ?? 0);
  }
}
