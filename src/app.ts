import app from 'commander'
import { Config } from './types/Config';
import { TimeLogger } from './TimeLogger';

(async () => {
  app
    .usage('[options] <command>')
    .option('-m, --message <comment>', 'Activities done during the time period')
    .option('-d, --debug', 'Show browser', false)
    .option('-l, --logs', 'Output page logs', false)
    .parse(process.argv);

  const config = new Config(app);

  const timeLogger = new TimeLogger(config);
  await timeLogger.run();
})();
