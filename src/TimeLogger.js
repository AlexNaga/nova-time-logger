/* eslint-disable class-methods-use-this */
const chalk = require('chalk');
const taskz = require('taskz');
const { AwHandler } = require('./AwHandler');
const { NovaHandler } = require('./NovaHandler');
const { infoMsg } = require('./lib/logHelper');
const { isWeekend } = require('./lib/dateHelper');
const { getEnvBool } = require('./lib/envHelper');

class TimeLogger {
  async run() {
    if (isWeekend()) {
      return infoMsg('Can\'t add shifts on weekends.');
    }

    const awHandler = new AwHandler();
    const novaHandler = new NovaHandler();

    const tasks = taskz([
      {
        text: chalk.cyan('Academic Work'),
        tasks: taskz([
          {
            text: 'Adding time report.',
            task: async () => await awHandler.run()
          },
        ]),
      },
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
