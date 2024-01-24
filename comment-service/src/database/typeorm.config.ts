import { DataSource, DataSourceOptions } from 'typeorm';
import CONNECTION from './connection';

const AppDataSource = new DataSource({
  ...(CONNECTION as DataSourceOptions),
  migrations: ['./src/database/migrations/*.ts'],
  entities: ['./src/**/model/entity/*.entity.ts'],
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

export default AppDataSource;
