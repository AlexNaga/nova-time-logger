const { errorMsg } = require('./lib/logHelper');
const { isWeekend } = require('./lib/dateHelper');
const { AwHandler } = require('./AwHandler');
const { NovaHandler } = require('./NovaHandler');

class TimeLogger {
  constructor() {

  }

  async run() {
    if (isWeekend()) {
      return errorMsg(`Can't add shifts on weekends.`);
    }

    const awHandler = new AwHandler();
    await awHandler.run();

    const novaHandler = new NovaHandler();
    await novaHandler.run();
  }
}

module.exports = { TimeLogger };