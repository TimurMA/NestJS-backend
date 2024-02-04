import { execSync } from 'child_process';
import { setupDockerEnv } from './utils/docker-environment/docker-environment';

require('ts-node/register');

const setup = async () => {
  await setupDockerEnv();
  execSync(
    'cd ../main-app && npm run migrate && cd ../comment-service && npm run migrate && cd ../gateway',
  );
};

export default setup;
