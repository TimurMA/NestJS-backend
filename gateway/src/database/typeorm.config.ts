import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config({ path: '../.env' });

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: +process.env.POSTGRES_PORT || 5435,
  database: process.env.POSTGRES_DATABASE || 'database',
  username: process.env.POSTGRES_USERNAME || 'username',
  password: process.env.POSTGRES_PASSWORD || 'password',
  migrations: ['./src/database/migrations/*.ts'],
  entities: ['./src/**/model/entity/*.entity.ts'],
  migrationsRun: true,
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

export default AppDataSource;

// type: 'postgres',
//   host: process.env.POSTGRES_HOST || 'localhost',
//   port: +process.env.POSTGRES_PORT || 5435,
//   database: process.env.POSTGRES_DATABASE || 'database',
//   username: process.env.POSTGRES_USERNAME || 'username',
//   password: process.env.POSTGRES_PASSWORD || 'password',
//   migrations: ['./src/database/migrations/*.ts'],
//   entities: ['./src/**/model/entity/*.entity.ts'],
//   migrationsRun: true,
