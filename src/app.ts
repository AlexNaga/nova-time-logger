import app from 'commander'
import { TimeLogger } from './TimeLogger';
import { getEnvBool } from './lib/envHelper';
// import { Timer } from './lib/Timer';
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

  // const timer = new Timer();
  // const isDebug = getEnvBool('IS_DEBUG');

  // if (isDebug) {
  //   console.time('timeLog')
  //   // timer.start();
  // }

  const timeLogger = new TimeLogger();
  await timeLogger.run();

  // if (isDebug) {
  //   console.time('timeLog')
  //   // timer.stop();
  // }
}

main();
