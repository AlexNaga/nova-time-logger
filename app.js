const program = require('commander');
const { errorMsg } = require('./src/lib/logHelper');
const { TimeLogger } = require('./src/TimeLogger');

const { env } = process;

async function main() {
  program
    .option('-d, --debug', 'Output page logs and show browser')
    .option('-m, --message <comment>', 'Activities done during the time period');

  program.parse(process.argv);

  if (program.debug === true) env.IS_DEBUG_MODE = true;
  if (program.message) env.MESSAGE = program.message;

  try {
    const timeLogger = new TimeLogger();
    await timeLogger.run();
  } catch (error) {
    console.log(error);
    return errorMsg('Unexpected error occurred.');
  }
}

main();
