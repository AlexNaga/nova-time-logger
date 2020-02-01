import { performance } from 'perf_hooks';
import chalk from 'chalk';

class Timer {
  startTime: number;
  endTime: number;

  constructor() {
    this.startTime = 0;
    this.endTime = 0;
  }

  start() {
    this.startTime = performance.now();
  }

  stop() {
    const endTime = performance.now();
    const runtimeInMs = (endTime - this.startTime);
    const runtimeInSec = (runtimeInMs / 1000).toFixed(2);
    console.log(`\nRuntime was: ${chalk.underline(runtimeInSec)}s`);
  }
}

const timer = new Timer();
export { timer };
