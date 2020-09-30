import app from 'commander';
import { Tasks } from './Tasks';
import { errorMsg } from './lib/logHelper';

(async () => {
  app
    .usage('[options] <command>')
    .option('-m, --message <string>', 'Activities done during the time period')
    .option('-d, --days <number>', 'Days to add or substract to todays date')
    .option('-h, --hours <number>', 'Number of hours to add')
    .option('-w, --week', 'If wanting to report for the whole week', false)
    .option('-p, --project <string>', 'Project name')
    .option('-io, --ioNumber <number>', 'The IO Number to report time to')
    .option('--debug', 'Show browser', false)
    .option('-l, --logs', 'Output page logs', false)
    .parse(process.argv);

  try {
    const tasks = new Tasks(app);
    await tasks.run();
  } catch (error) {
    errorMsg(error);
  }
})();
