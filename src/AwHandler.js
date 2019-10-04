require('dotenv').config();
const chalk = require('chalk');
const puppeteer = require('puppeteer');
const { errorMsg, successMsg, pageLog } = require('./lib/logHelper');
const { getFilePath } = require('./lib/fileHelper');
const { openImage } = require('./lib/openImage');

const { env } = process;

class AwHandler {
  constructor() {
    this.url = env.AW_URL;
    this.username = env.AW_USERNAME;
    this.password = env.AW_PASSWORD;
    this.debug = env.IS_DEBUG_MODE;
    this.shiftAlreadyExists = false;
  }

  async init() {
    this.browser = await puppeteer.launch({
      headless: !this.debug,
      defaultViewport: {
        height: 1800,
        width: 1200
      }
      // slowMo: 250, // Time in ms
    });

    this.page = await this.browser.newPage();

    if (this.debug) {
      this.page.on('console', (msg) => pageLog(`(${chalk.cyan('AW')}) ${msg.text()}`));
    }
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
      errorMsg(`Shift already exists in ${chalk.cyan('AW')}.`);
    } else {
      await this.page.waitFor(200);
      successMsg(`Added shift to ${chalk.cyan('AW')}.`);
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
      height: 800,
      width: 830,
      x: 330,
      y: 510,
    };

    if (this.shiftAlreadyExists) {
      screenshotSize.height = 1230;
      screenshotSize.width = 830;
    }

    await this.page.screenshot({
      path: filePath,
      clip: {
        ...screenshotSize
      },
    });
  }

  async closeBrowser() {
    await this.browser.close();
  }

  async exit() {
    const filePath = getFilePath('aw');
    await this.takeScreenshot(filePath);
    await openImage(filePath);
    await this.closeBrowser();
  }
}

module.exports = { AwHandler };
