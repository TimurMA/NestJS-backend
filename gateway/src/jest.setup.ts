import { execSync } from 'child_process';
import { setupDockerEnv } from './utils/docker-environment/docker-environment';

require('ts-node/register');

const setup = async () => {
  await setupDockerEnv();
  execSync('npm run migrate');
};

export default setup;
