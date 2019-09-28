const chalk = require('chalk');

const errorMsg = (msg) => {
  console.log(chalk.red.bold('Error: ') + msg);
};

const infoMsg = (msg) => {
  console.log(chalk.blue.bold('Info: ') + msg);
};

const successMsg = (msg) => {
  console.log(chalk.green.bold('Success: ') + msg);
};

module.exports = {
  errorMsg,
  infoMsg,
  successMsg,
};