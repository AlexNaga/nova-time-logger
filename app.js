#!/usr/bin/env node

const { TimeLogger } = require('./src/TimeLogger');
const { Timer } = require('./src/lib/Timer');
const { getEnvBool } = require('./src/lib/envHelper');
const app = require('commander');
require('dotenv').config({ path: __dirname + '/.env' });
const { env } = process;

async function main() {
  app
    .usage('[options] <command>')
    .option('-d, --debug', 'Show browser')
    .option('-l, --logs', 'Output page logs')
    .option('-m, --message <comment>', 'Activities done during the time period')
    .parse(process.argv);

  if (app.debug === true) env.IS_DEBUG_MODE = true;
  if (app.logs === true) env.SHOW_CONSOLE_LOG = true;
  if (app.message) env.MESSAGE = app.message;

  const timer = new Timer();
  const isDebug = getEnvBool('IS_DEBUG_MODE');

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
