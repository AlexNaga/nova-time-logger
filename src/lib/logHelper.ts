const chalk = require('chalk');

export const errorMsg = (msg: string) => {
  throw new Error(msg);
};

export const infoMsg = (msg: string) => {
  console.log(chalk.blue.bold('Info: ') + msg);
};

export const successMsg = (msg: string) => {
  console.log(chalk.green.bold('Success: ') + msg);
};

export const pageLog = (msg: string) => {
  console.log(chalk.yellow.bold('Page log: ') + msg);
};
