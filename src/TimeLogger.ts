import { infoMsg } from './lib/logHelper';
import { isWeekend } from './lib/dateHelper';
import { NovaHandler } from './NovaHandler';
import chalk from 'chalk';
import taskz from 'taskz';

class TimeLogger {
  async run() {
    // if (isWeekend()) {
    //   return infoMsg('Can\'t add shifts on weekends.');
    // }

    const novaHandler = new NovaHandler();
    const tasks = taskz([
      {
        text: chalk.magenta('Nova'),
        tasks: taskz([
          {
            text: 'Adding time report.',
            task: async () => await novaHandler.run()
          },
        ]),
      },
    ]);

    await tasks.run();
  }
}

const timeLogger = new TimeLogger();
export { timeLogger };
