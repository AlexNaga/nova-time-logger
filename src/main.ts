import app from 'commander';
import { Tasks } from './Tasks';
import { errorMsg } from './lib/logHelper';

(async () => {
  app
    .usage('[options] <command>')
    .option('-m, --message <comment>', 'Activities done during the time period', '-')
    .option('-d, --debug', 'Show browser', false)
    .option('-l, --logs', 'Output page logs', false)
    .parse(process.argv);

  try {
    const tasks = new Tasks(app);
    await tasks.run();
  } catch (error) {
    errorMsg(error);
  }
})();
