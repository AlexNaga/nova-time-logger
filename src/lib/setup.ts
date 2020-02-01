import { CommanderStatic } from 'commander';

export const setup = async (app: CommanderStatic) => {
  if (app.message) process.env.MESSAGE = app.message;
  if (app.debug === true) process.env.IS_DEBUG = 'true';
  if (app.logs === true) process.env.SHOW_LOGS = 'true';
};

export const env = {
  NOVA_URL: process.env.NOVA_URL,
  NOVA_USERNAME: process.env.NOVA_USERNAME,
  NOVA_PASSWORD: process.env.NOVA_PASSWORD,
  MESSAGE: process.env.MESSAGE,
  IS_DEBUG: process.env.IS_DEBUG === 'true',
  SHOW_LOGS: process.env.SHOW_LOGS === 'true',
};
