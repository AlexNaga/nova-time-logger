import { CommanderStatic } from 'commander';
import { ConfigInterface } from '../types/ConfigInterface';

export class Config implements ConfigInterface {
  site = '';
  url = '';
  username = '';
  password = '';
  project = '';
  message = '';
  isDebug = false;
  showLogs = false;

  constructor(app: CommanderStatic) {
    this.message = app.message || '';
    this.isDebug = app.debug === true;
    this.showLogs = app.logs === true;
  }
}
