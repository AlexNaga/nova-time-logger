const { TimeLogger } = require('./src/TimeLogger');
const { Timer } = require('./src/lib/Timer');
const program = require('commander');
const { env } = process;

async function main() {
  program
    .usage('[options] <command>')
    .option('-d, --debug', 'Show browser')
    .option('-l, --logs', 'Output page logs')
    .option('-m, --message <comment>', 'Activities done during the time period')
    .parse(process.argv);

  if (program.debug === true) env.IS_DEBUG_MODE = true;
  if (program.logs === true) env.SHOW_CONSOLE_LOG = true;
  if (program.message) env.MESSAGE = program.message;

  const timer = new Timer();
  const isDebug = env.IS_DEBUG_MODE;

  if (isDebug) {
    timer.start();
  }

  const timeLogger = new TimeLogger();
  await timeLogger.run();

  if (isDebug) {
    timer.stop();
  }
}

main();
