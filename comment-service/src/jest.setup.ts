import { execSync } from 'child_process';
import { config } from 'dotenv';
import { GenericContainer } from 'testcontainers';

require('ts-node/register');

config({ path: '../.env' });

const setup = async () => {
  const container = new GenericContainer('postgres')
    .withExposedPorts({
      container: 5432,
      host: 5435,
    })
    .withName('db_test_comment_service')
    .withEnvironment({
      POSTGRES_DB: process.env.POSTGRES_DATABASE,
      POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
      POSTGRES_USER: process.env.POSTGRES_USERNAME,
    });
  await container.start();
  execSync('cd ../main-app && npm run migrate && cd ../comment-service');
  execSync('npm run migrate');
};

export default setup;
