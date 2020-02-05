import { ConfigInterface } from './types/ConfigInterface';
import { errorMsg, infoMsg } from './lib/logHelper';
import { isWeekend } from './lib/dateHelper';
import { NovaHandler } from './NovaHandler';
import { timer } from './lib/Timer';
import chalk from 'chalk';
import taskz from 'taskz';

export class TimeLogger {
  config: ConfigInterface;

  constructor(config: ConfigInterface) {
    this.config = config;
  }

  async run() {
    try {
      if (isWeekend()) {
        return infoMsg('Can\'t add shifts on weekends.');
      }

      const novaConfig: ConfigInterface = {
        ...this.config,
        site: 'Nova',
        url: process.env.NOVA_URL!,
        username: process.env.NOVA_USERNAME!,
        password: process.env.NOVA_PASSWORD!,
        project: process.env.NOVA_PROJECT!,
      };

      const novaHandler = new NovaHandler(novaConfig);
      const tasks = taskz([
        {
          text: chalk.magenta(this.config.site),
          tasks: taskz([
            {
              text: 'Adding time report.',
              task: async () => await novaHandler.run()
            },
          ]),
        },
      ]);

      if (this.config.isDebug) { timer.start(); }

      await tasks.run();

      if (this.config.isDebug) { timer.stop(); }
    } catch (error) {
      errorMsg(error.message);
      return;
    }
  }
}
