import { CommanderStatic } from 'commander';
import { ConfigInterface } from '../interfaces/ConfigInterface';
import { negative, positive } from 'check-types';

export class Config implements ConfigInterface {
  site: string = '';
  url: string = '';
  username: string = '';
  password: string = '';
  project: string = '';
  message: string = '';
  isDebug: boolean = false;
  showLogs: boolean = false;
  days: number = 0;

  constructor(app: CommanderStatic, site: string) {
    this.site = site.toUpperCase();

    this.url = process.env['NOVA_URL']!;
    this.username = process.env['NOVA_USERNAME']!;
    this.password = process.env['NOVA_PASSWORD']!;
    this.project = process.env['NOVA_PROJECT']?.toUpperCase()!;

    // Check if we should add or subtract days from todays date
    if (validateInt(app.days)) this.days = app.days;

    this.message = app.message || '';
    this.isDebug = app.debug === true;
    this.showLogs = app.logs === true;
  }
}

const validateInt = (num: string) => positive(parseInt(num)) || negative(parseInt(num));
