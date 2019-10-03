const { TimeLogger } = require('./src/TimeLogger');
const { Timer } = require('./src/lib/Timer');
const program = require('commander');
const { env } = process;

async function main() {
  program
    .usage('[options] <command>')
    .option('-d, --debug', 'Output page logs and show browser')
    .option('-m, --message <comment>', 'Activities done during the time period')
    .parse(process.argv);

  if (program.debug === true) env.IS_DEBUG_MODE = true;
  if (program.message) env.MESSAGE = program.message;

  // const timer = new Timer();
  // timer.start();

  const timeLogger = new TimeLogger();
  await timeLogger.run();

  // timer.stop();
}

main();
