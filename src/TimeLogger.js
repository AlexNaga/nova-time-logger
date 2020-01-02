/* eslint-disable class-methods-use-this */
const { getEnvBool } = require('./lib/envHelper');
const { infoMsg } = require('./lib/logHelper');
const { isWeekend } = require('./lib/dateHelper');
const { NovaHandler } = require('./NovaHandler');
const chalk = require('chalk');
const taskz = require('taskz');

class TimeLogger {
  async run() {
    if (isWeekend()) {
      return infoMsg('Can\'t add shifts on weekends.');
    }

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
    ], { parallel: !getEnvBool('IS_DEBUG_MODE') });

    await tasks.run();
  }
}

module.exports = { TimeLogger };
