import app from 'commander';
import { TimeLogger } from './TimeLogger';
import { errorMsg } from './lib/logHelper';

(async () => {
  app
    .usage('[options] <command>')
    .option('-m, --message <comment>', 'Activities done during the time period', '-')
    .option('-d, --debug', 'Show browser', false)
    .option('-l, --logs', 'Output page logs', false)
    .parse(process.argv);

  try {
    const timeLogger = new TimeLogger(app);
    await timeLogger.run();
  } catch (error) {
    errorMsg(error);
  }
})();
