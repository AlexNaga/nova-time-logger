const { TimeLogger } = require('./src/TimeLogger');
const config = require("../config/config.json");
const SERVER = config.SERVER;
const PORT = config.PORT;

(async () => {
  try {
    const timeLogger = new TimeLogger(url, username, password);
    await timeLogger.run();
  } catch (error) {
    return error(`Unexpected error occurred.`);
  }
})();
