import { Role } from 'src/core/roles/entities/role.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class Roles1741498699564 implements Seeder {
  track = false;

  // @ts-ignore
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const repo = dataSource.getRepository(Role);
    const result = await repo
      .createQueryBuilder()
      .insert()
      .values([
        {
          name: 'superadmin',
          description: 'superadmin',
          isActive: true,
        },
        {
          name: 'admin',
          description: 'admin',
          isActive: true,
        },
        {
          name: 'user',
          description: 'user',
          isActive: true,
        },
      ])
      .orIgnore()
      .execute();

    console.log('DONE: roles seeder %d inserted', result.raw?.length ?? 0);
  }
}
