import { config } from 'dotenv';
import {
  StartedDockerComposeEnvironment,
  DockerComposeEnvironment,
} from 'testcontainers';

config({ path: '../.env' });

let environment: StartedDockerComposeEnvironment;

const setupDockerEnv = async () => {
  environment = await new DockerComposeEnvironment(
    './',
    'docker-compose-test.yml',
  ).up();
};

const downDockerEnv = async () => {
  if (environment) {
    await environment.down({ removeVolumes: true });
  }
};

export { setupDockerEnv, downDockerEnv };
