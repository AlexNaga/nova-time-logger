const { errorMsg, infoMsg, successMsg } = require('./lib/logHelper');
const { getFilePath } = require('./lib/fileHelper');
const { isWeekend } = require('./lib/dateHelper');
const { openImage } = require('./lib/openImage');
const puppeteer = require('puppeteer');

class TimeLogger {
  constructor(url, username, password, isDebugMode) {
    this.url = url;
    this.username = username;
    this.password = password;
    this.debug = isDebugMode
  }

  async init() {
    this.browser = await puppeteer.launch({
      headless: true,
      // slowMo: 250, // Time in ms
    });

    this.page = await this.browser.newPage();
  }

  async run() {
    if (isWeekend()) {
      return infoMsg(`Can't add shifts on weekends.`);
    }

    if (this.debug) {
      this.page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    }

    await this.init();
    await this.page.goto(this.url);
    await this.login(this.username, this.password);
    await this.page.waitForNavigation();
    await this.addShift();

    const timeoutInMs = 2000;
    let shiftAlreadyExists = false;

    try {
      await this.page.waitForSelector('.work-shift-admin', { hidden: true, timeout: timeoutInMs });
    } catch (error) {
      shiftAlreadyExists = true;
    }

    if (shiftAlreadyExists) {
      errorMsg('Shift already exists.');
    } else {
      await this.page.waitFor(200);
      successMsg('Added shift.');
    }

    const filePath = getFilePath();
    await this.takeScreenshot(filePath);
    await openImage(filePath);

    this.closeBrowser();
  }

  async login(user, pw) {
    const userField = '#username';
    const pwField = '#password';
    const loginBtn = '#login-btn';

    await this.page.waitForSelector(userField);
    await this.page.type(userField, user);

    await this.page.waitForSelector(pwField);
    await this.page.type(pwField, pw);

    await this.page.waitForSelector(loginBtn);
    await this.page.click(loginBtn);
  };

  async addBreakTime() {
    const breakTimeInMinutes = '60';
    const addShiftBtn = '.time-report-header-nav button';
    const timeInput = 'input[data-e2e=break]';

    await this.page.waitForSelector(addShiftBtn);
    await this.page.click(addShiftBtn);

    await this.page.waitForSelector(timeInput);

    await this.page.focus(timeInput);
    await this.page.keyboard.press('Backspace');
    await this.page.type(timeInput, breakTimeInMinutes, { delay: 20 });
  };

  async addShift() {
    await this.addBreakTime();

    const submitShiftBtn = 'button[data-e2e=add-shift-btn]';
    await this.page.waitForSelector(submitShiftBtn);
    await this.page.click(submitShiftBtn);
  };

  async takeScreenshot(filePath) {
    await this.page.screenshot({
      path: filePath,
      clip: {
        x: 250,
        y: 420,
        width: 480,
        height: 1515,
      },
    });
  };

  async closeBrowser() {
    await this.browser.close();
  }
}

module.exports = { TimeLogger };