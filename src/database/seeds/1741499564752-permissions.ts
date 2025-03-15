import { Permission } from 'src/core/permissions/entities/permission.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class Permissions1741499564752 implements Seeder {
  track = false;

  // @ts-ignore
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const data: Record<string, string[]> = {
      roles: [
        'create',
        'find-all',
        'find-one',
        'update',
        'soft-delete',
        'hard-delete',
        'restore',
        'assign-permissions',
      ],
      permissions: [
        'create',
        'find-all',
        'find-one',
        'update',
        'soft-delete',
        'hard-delete',
        'restore',
      ],
      users: [
        'create',
        'find-all',
        'find-one',
        'update',
        'soft-delete',
        'hard-delete',
        'restore',
        'assign-role',
      ],
    };

    const repo = dataSource.getRepository(Permission);
    const result = await repo
      .createQueryBuilder()
      .insert()
      .values(
        Object.entries(data).flatMap(([feature, actions]) =>
          actions.map((action) => ({ feature, action }))
        )
      )
      .orIgnore()
      .execute();

    console.log(
      'DONE: permissions seeder %d inserted',
      result.raw?.length ?? 0
    );
  }
}
