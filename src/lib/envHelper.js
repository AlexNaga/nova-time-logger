const { env } = process;

const getEnv = envName => env[envName.toUpperCase()];

const getEnvBool = envName => {
  const isTrue = env[envName.toUpperCase()] === 'true';
  return isTrue;
};

module.exports = {
  getEnv,
  getEnvBool,
};
