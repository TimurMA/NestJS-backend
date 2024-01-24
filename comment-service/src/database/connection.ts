import { config } from 'dotenv';

config({ path: '../.env' });

const CONNECTION = {
  type: 'postgres',
  host: 'localhost',
  port: 5434,
  database: process.env.COMMENT_DATABASE ?? 'database',
  username: process.env.COMMENT_USERNAME ?? 'username',
  password: process.env.COMMENT_PASSWORD ?? 'password',
};

export default CONNECTION;
