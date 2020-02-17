import { CommanderStatic } from 'commander';
import { ConfigInterface } from '../interfaces/ConfigInterface';

export class Config implements ConfigInterface {
  site: string = '';
  url: string = '';
  username: string = '';
  password: string = '';
  project: string = '';
  message: string = '';
  isDebug: boolean = false;
  showLogs: boolean = false;

  constructor(app: CommanderStatic, site: string) {
    this.site = site.toUpperCase();

    this.url = process.env['NOVA_URL']!;
    this.username = process.env['NOVA_USERNAME']!;
    this.password = process.env['NOVA_PASSWORD']!;
    this.project = process.env['NOVA_PROJECT']!;

    // TODO: Right now we can't load dotenv variables dynamically
    // this.url = getEnv(this.site, 'URL');
    // this.username = getEnv(this.site, 'USERNAME');
    // this.password = getEnv(this.site, 'PASSWORD');
    // this.project = getEnv(this.site, 'PROJECT');

    this.message = app.message || '';
    this.isDebug = app.debug === true;
    this.showLogs = app.logs === true;
  }
}

const getEnv = (site: string, key: string) => {
  const envKey = site + '_' + key;
  const envItem = process.env[envKey];

  if (!envItem) {
    throw new Error(`Missing config key: ${envKey}, please check .env.example`);
  } else {
    return envItem;
  }
};
