const program = require('commander');
const { TimeLogger } = require('./src/TimeLogger');

const { env } = process;

async function main() {
  program
    .usage('[options] <command>')
    .option('-d, --debug', 'Output page logs and show browser')
    .option('-m, --message <comment>', 'Activities done during the time period')
    .parse(process.argv);

  if (program.debug === true) env.IS_DEBUG_MODE = true;
  if (program.message) env.MESSAGE = program.message;

  const timeLogger = new TimeLogger();
  timeLogger.run();
}

main();
