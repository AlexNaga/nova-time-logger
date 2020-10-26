import chalk from 'chalk';

export const errorMsg = (msg: string) => {
  console.log(chalk.red.bold('Error: ') + msg);
};

export const infoMsg = (msg: string) => {
  console.log(chalk.blue.bold('Info: ') + msg);
};

export const successMsg = (msg: string) => {
  console.log(chalk.green.bold('Success: ') + msg);
};

export const quoteMsg = (msg: string) => {
  console.log('\n' + chalk.blue.bold('Quote of the day: ') + chalk.italic(msg));
};

export const pageLog = (msg: string) => {
  console.log(chalk.yellow.bold('Page log: ') + msg);
};
