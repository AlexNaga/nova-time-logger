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
  hours: number = 8; // default to 8 working hours in a day
  days: number = 0;
  week: boolean = false;

  constructor(app: CommanderStatic, site: string) {
    this.site = site.toUpperCase();

    const project = app.project || process.env['DEFAULT_PROJECT'];
    this.project = project.toUpperCase();
    this.url = process.env['URL']!;
    this.username = process.env['USERNAME']!;
    this.password = process.env['PASSWORD']!;

    const firstName = this.username.split(' ')[0].toUpperCase();
    this.ioNumber = app.ioNumber || firstName;
    this.message = app.message || process.env['DEFAULT_MESSAGE'] || '';
    this.week = app.week === true;
    this.isDebug = app.debug === true;
    this.showLogs = app.logs === true;

    // Check if we should add or subtract days from todays date
    if (validateInt(app.days)) this.days = app.days;
    if (validateInt(app.hours)) {
      this.hours = app.hours;
    } else if (this.week) {
      const weekWorkingHours = 40;
      this.hours = weekWorkingHours;
    }
  }
}

export const validateInt = (num: string) => positive(parseInt(num)) || negative(parseInt(num));
