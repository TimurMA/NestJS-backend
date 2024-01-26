import { config } from 'dotenv';

config({ path: '../.env' });

const CONNECTION = {
  type: 'postgres',
  host: process.env.COMMENT_HOST || 'localhost',
  port: +process.env.COMMENT_PORT || 5432,
  database: process.env.COMMENT_DATABASE || 'database',
  username: process.env.COMMENT_USERNAME || 'username',
  password: process.env.COMMENT_PASSWORD || 'password',
};

export default CONNECTION;
