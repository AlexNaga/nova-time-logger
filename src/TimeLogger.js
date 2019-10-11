/* eslint-disable class-methods-use-this */
const chalk = require('chalk');
const taskz = require('taskz');
const { errorMsg } = require('./lib/logHelper');
const { isWeekend } = require('./lib/dateHelper');
const { AwHandler } = require('./AwHandler');
const { NovaHandler } = require('./NovaHandler');

class TimeLogger {
  async run() {
    if (isWeekend()) {
      return errorMsg('Can\'t add shifts on weekends.');
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

    ], { parallel: true }); // Comment this out if time logging is needed

    // ]); // Uncomment this if time logging is needed

    await tasks.run();
  }
}

module.exports = { TimeLogger };
