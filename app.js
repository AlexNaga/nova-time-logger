const { TimeLogger } = require('./src/TimeLogger');
require('dotenv').config();

const url = process.env.URL;
const username = process.env.USERNAME;
const password = process.env.PASSWORD;

(async () => {
  try {
    const timeLogger = new TimeLogger(url, username, password);
    await timeLogger.run();
  } catch (error) {
    return error(`Unexpected error occurred.`);
  }
})();
