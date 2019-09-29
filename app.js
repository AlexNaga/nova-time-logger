const { errorMsg } = require('./src/lib/logHelper');
const { TimeLogger } = require('./src/TimeLogger');

async function main() {
  try {
    const timeLogger = new TimeLogger();
    await timeLogger.run();
  } catch (error) {
    console.log(error);
    return errorMsg(`Unexpected error occurred.`);
  }
}

main();
