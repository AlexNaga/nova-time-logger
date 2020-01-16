const env = process.env;

export const getEnv = (envName: string) => env[envName.toUpperCase()];

export const getEnvBool = (envName: string) => {
  const isTrue = env[envName.toUpperCase()] === 'true';
  return isTrue;
};
