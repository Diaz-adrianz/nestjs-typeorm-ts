import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { config as dotenvConfig } from 'dotenv';
import { SeederOptions } from 'typeorm-extension';

dotenvConfig({ path: '.env' });

const isCompiled = __filename.endsWith('.js');
export const typeOrmOptions: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: `${process.env.DATABASE_HOST}`,
  port: parseInt(process.env.DATABASE_PORT ?? '', 5432),
  username: `${process.env.DATABASE_USERNAME}`,
  password: `${process.env.DATABASE_PASSWORD}`,
  database: `${process.env.DATABASE_NAME}`,
  entities: [isCompiled ? 'dist/**/*.entity.js' : 'src/**/*.entity.ts'],
  migrations: [
    isCompiled
      ? 'dist/database/migrations/*.js'
      : 'src/database/migrations/*.ts',
  ],
  seeds: ['src/database/seeds/*.{ts,js}'],
  seedTracking: false,
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
};

const dataSource = new DataSource(typeOrmOptions);
export default dataSource;
