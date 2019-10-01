const { performance } = require('perf_hooks');
const chalk = require('chalk');

class Timer {
  constructor() {
    this.startTime = 0;
    this.endTime = 0;
  }

  start() {
    this.startTime = performance.now();
  }

  stop() {
    const endTime = performance.now();
    const runtimeInMs = (endTime - this.startTime) / 1000;
    const runtimeInSec = runtimeInMs.toFixed(2);
    console.log(`\nRuntime was: ${chalk.underline(runtimeInSec)}s`);
  }
}

module.exports = { Timer };
