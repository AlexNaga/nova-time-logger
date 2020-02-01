import app from 'commander'
import { timeLogger } from './TimeLogger';
import { setup, env } from './lib/setup';

(async () => {
  app
    .usage('[options] <command>')
    .option('-m, --message <comment>', 'Activities done during the time period')
    .option('-d, --debug', 'Show browser')
    .option('-l, --logs', 'Output page logs')
    .parse(process.argv);

  await setup(app);

  console.log(app.debug);
  console.log(env.IS_DEBUG);

  await timeLogger.run();
})();
