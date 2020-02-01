import app from 'commander'
import { getEnvBool } from './lib/envHelper';
import { timeLogger } from './TimeLogger';
import { timer } from './lib/Timer';
const env = process.env;

async function main() {
  app
    .usage('[options] <command>')
    .option('-d, --debug', 'Show browser')
    .option('-l, --logs', 'Output page logs')
    .option('-m, --message <comment>', 'Activities done during the time period')
    .parse(process.argv);

  // if (app.debug === true) env.IS_DEBUG = 'true';
  // if (app.logs === true) env.SHOW_CONSOLE_LOG = 'true';
  // if (app.message) env.MESSAGE = app.message;

  const isDebug = getEnvBool('IS_DEBUG');

  if (isDebug) {
    timer.start();
  }

  await timeLogger.run();

  if (isDebug) {
    timer.stop();
  }
}

main();
