import { downDockerEnv } from './utils/docker-environment/docker-environment';

const teardown = async () => {
  await downDockerEnv();
};

export default teardown;
