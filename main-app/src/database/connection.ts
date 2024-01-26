import { config } from 'dotenv';

config({ path: '../.env' });

const CONNECTION = {
  type: 'postgres',
  host: process.env.MAIN_HOST || 'localhost',
  port: +process.env.MAIN_PORT || 5435,
  database: process.env.MAIN_DATABASE || 'database',
  username: process.env.MAIN_USERNAME || 'username',
  password: process.env.MAIN_PASSWORD || 'password',
};

export default CONNECTION;
