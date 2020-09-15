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
  ioNumber: string = '';
  isDebug: boolean = false;
  showLogs: boolean = false;
  days: number = 0;

  constructor(app: CommanderStatic, site: string) {
    this.site = site.toUpperCase();

    const project = app.project || process.env['DEFAULT_NOVA_PROJECT'];
    this.project = project.toUpperCase();
    this.url = process.env['NOVA_URL']!;
    this.username = process.env['NOVA_USERNAME']!;
    this.password = process.env['NOVA_PASSWORD']!;

    // Check if we should add or subtract days from todays date
    if (validateInt(app.days)) this.days = app.days;

    const firstName = this.username.split(' ')[0].toUpperCase();
    this.ioNumber = app.ioNumber || firstName;
    this.message = app.message || '';
    this.isDebug = app.debug === true;
    this.showLogs = app.logs === true;
  }
}

export const validateInt = (num: string) => positive(parseInt(num)) || negative(parseInt(num));
