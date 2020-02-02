import { env } from './lib/setup';
import { errorMsg, infoMsg } from './lib/logHelper';
import { isWeekend } from './lib/dateHelper';
import { NovaHandler } from './NovaHandler';
import { timer } from './lib/Timer';
import chalk from 'chalk';
import taskz from 'taskz';

class TimeLogger {
  async run() {
    try {
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

      if (env.IS_DEBUG) timer.start();

      await tasks.run();

      if (env.IS_DEBUG) timer.stop();
    } catch (error) {
      errorMsg(error.message);
      return;
    }
  }
}

const timeLogger = new TimeLogger();
export { timeLogger };
