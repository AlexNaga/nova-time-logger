const { BrowserHandler } = require('./BrowserHandler');
const { errorMsg, successMsg } = require('./lib/logHelper');
const { getEnv } = require('./lib/envHelper');
const chalk = require('chalk');

class AwHandler extends BrowserHandler {
  constructor() {
    const url = getEnv('AW_URL');
    const username = getEnv('AW_USERNAME');
    const password = getEnv('AW_PASSWORD');
    const config = {
      site: 'AW',
      screen: {
        height: 1800,
        width: 1200
      }
    };

    super(url, username, password, config);
    this.shiftAlreadyExists = false;
  }

  async run() {
    await this.init();
    await this.page.goto(this.url);
    await this.login(this.username, this.password);
    await this.page.waitForNavigation();
    await this.addShift();

    const timeoutInMs = 2000;

    try {
      // If this element gets hidden the shift was successfully added
      await this.page.waitFor('.work-shift-admin', { hidden: true, timeout: timeoutInMs });
    } catch (error) {
      this.shiftAlreadyExists = true;
    }

    if (this.shiftAlreadyExists) {
      await this.exit();
      errorMsg(`Shift already exists in ${chalk.cyan(this.config.site)}.`);
    } else {
      await this.page.waitFor(200);
      successMsg(`Added shift to ${chalk.cyan(this.config.site)}.`);
    }

    await this.exit();
  }

  async login(user, pw) {
    const userField = '#username';
    const pwField = '#password';
    const loginBtn = '#login-btn';

    await this.page.waitFor(userField);
    await this.page.type(userField, user);

    await this.page.waitFor(pwField);
    await this.page.type(pwField, pw);

    await this.page.waitFor(loginBtn);
    await this.page.click(loginBtn);
  }

  async addBreakTime() {
    const breakTimeInMinutes = '60';
    const addShiftBtn = '.time-report-header-nav button';
    const timeInput = 'input[data-e2e=break]';

    await this.page.waitFor(addShiftBtn);
    await this.page.click(addShiftBtn);

    await this.page.waitFor(timeInput);

    await this.page.focus(timeInput);
    await this.page.keyboard.press('Backspace');
    await this.page.type(timeInput, breakTimeInMinutes, { delay: 20 });
  }

  async addShift() {
    await this.addBreakTime();

    const submitShiftBtn = 'button[data-e2e=add-shift-btn]';
    await this.page.waitFor(submitShiftBtn);
    await this.page.click(submitShiftBtn);
  }

  async takeScreenshot(filePath) {
    const screenshotSize = {
      height: 950,
      width: 830,
      x: 330,
      y: 350,
    };

    if (this.shiftAlreadyExists) {
      screenshotSize.height = 1400;
      screenshotSize.width = 830;
    }

    await this.page.screenshot({
      path: filePath,
      clip: {
        ...screenshotSize
      },
    });
  }
}

module.exports = { AwHandler };
