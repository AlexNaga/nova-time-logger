import { Config } from './lib/Config';
import { CommanderStatic } from 'commander';
import { infoMsg, quoteMsg } from './lib/logHelper';
import { getDate, isWeekend } from './lib/dateHelper';
import { NovaHandler } from './NovaHandler';
import { timer } from './lib/Timer';
import chalk from 'chalk';
import taskz from 'taskz';
import { getRandomQuote } from './lib/quotes';

export class Tasks {
  novaConfig: Config;

  constructor(app: CommanderStatic) {
    this.novaConfig = new Config(app, 'NOVA');
  }

  async run() {
    try {
      if (isWeekend(this.novaConfig.days)) {
        return infoMsg('Can\'t add shifts on weekends.');
      }

      const date = getDate({ divider: '/', days: this.novaConfig.days });

      const novaHandler = new NovaHandler(this.novaConfig);
      const tasks = taskz([
        {
          text: chalk.magenta(this.novaConfig.site),
          tasks: taskz([
            {
              text: `${date}: Adding time report${this.novaConfig.week ? ' for week' : ''}.`,
              task: async () => await novaHandler.run(),
            },
          ]),
        },
      ]);

      if (this.novaConfig.isDebug) {
        timer.start();
      }

      await tasks.run();

      if (this.novaConfig.isDebug) {
        timer.stop();
      }

      quoteMsg(getRandomQuote());
    } catch (error) {
      return error.message;
    }
  }
}
