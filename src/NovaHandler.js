const { BrowserHandler } = require('./BrowserHandler');
const { capitalize } = require('./lib/fileHelper');
const { errorMsg, successMsg } = require('./lib/logHelper');
const { getDate, getMonth, getLastMonth } = require('./lib/dateHelper');
const { getEnv } = require('./lib/envHelper');
const chalk = require('chalk');

class NovaHandler extends BrowserHandler {
  constructor() {
    const url = getEnv('NOVA_URL');
    const username = getEnv('NOVA_USERNAME');
    const password = getEnv('NOVA_PASSWORD');
    const config = { site: 'Nova' };
    super(url, username, password, config);
  }

  async run() {
    await this.init();
    await this.page.goto(this.url);
    await this.login(this.username, this.password);
    await this.page.waitForNavigation();

    await this.isSameDate();
    await this.clickTimeReportPage();

    let shiftAlreadyExists = await this.isShiftAlreadyAdded();

    if (shiftAlreadyExists) {
      await this.exit();
      errorMsg(`Shift already exists in ${chalk.magenta(this.config.site)}.`);
    }

    while (shiftAlreadyExists === false) {
      await this.addShift();
      await this.waitForTimeReportPage();
      shiftAlreadyExists = await this.isShiftAlreadyAdded();
    }

    successMsg(`Added shift to ${chalk.magenta(this.config.site)}.`);
    await this.exit();
  }

  async isShiftAlreadyAdded() {
    const allTxtContent = await this.page.$$('.text');
    const dateNow = getDate('/');
    let dateCount = 0;

    for (const elem of allTxtContent) {
      const label = await this.page.evaluate((e) => e.textContent.toLowerCase(), elem);
      const dateExists = label.includes(dateNow);

      if (dateExists) {
        dateCount += 1;
      }
    }

    dateCount -= 1; // Since the date is always visible on the site

    if (dateCount < 0) {
      await this.exit();
      errorMsg(`The script doesn't match todays date on ${chalk.magenta(this.config.site)}.`);
    }

    // Shift exists
    if (dateCount >= 1) {
      return true;
    }
    return false; // Shift doesn't exist
  }

  async login(user, pw) {
    const userField = '#login_name';
    const pwField = '#login_pwd';
    const loginBtn = '#login_nonguest';

    await this.waitForLoginPage(userField, pwField, loginBtn);
    await this.page.type(userField, user);
    await this.page.type(pwField, pw);
    await this.page.click(loginBtn);
  }

  async waitForLoginPage(userField, pwField, loginBtn) {
    try {
      await this.page.waitFor(userField);
      await this.page.waitFor(pwField);
      await this.page.waitFor(loginBtn);
      await this.hasPageTxt('sign in');
    } catch (error) {
      await this.exit();
      errorMsg(`Can't open login page on ${chalk.magenta(this.config.site)}.`);
    }
  }

  async isSameDate() {
    try {
      const dateNow = getDate('/');
      await this.hasPageTxt(dateNow);
    } catch (error) {
      await this.exit();
      errorMsg(`The script doesn't match todays date on ${chalk.magenta(this.config.site)}.`);
    }
  }

  async clickTimeReportPage() {
    const timeReportTab = '#b0p1o331i0i0r1';
    await this.page.waitFor(timeReportTab);
    await this.page.click(timeReportTab);
    await this.waitForTimeReportPage();
  }

  async waitForTimeReportPage() {
    try {
      const lastMonth = getLastMonth(); // This only exists on time report page
      await this.hasPageTxt(lastMonth);

    } catch (error) {
      await this.exit();
      errorMsg(`Can't open time reports page on ${chalk.magenta(this.config.site)}.`);
    }
  }

  async hasPageTxt(searchTxt) {
    return await this.page.waitForFunction(searchTxt => {
      const txtOnPage = document.querySelector('body').innerText.toLowerCase();
      return txtOnPage.includes(searchTxt);
    }, {}, searchTxt);
  }

  async addShift() {
    const addShiftBtn = '#b0p6o368i0i0r1';
    await this.page.waitFor(addShiftBtn);
    await this.page.click(addShiftBtn);

    const projectSelectionPage = '#b0p2o1181i0i0r1';
    await this.page.waitFor(projectSelectionPage);

    await this.clickWantedProject();
    await this.clickCreateReport();
    await this.selectCategory();
    await this.addBillableHours();
    await this.selectTeam();
    await this.addComment(getEnv('MESSAGE'));
    await this.saveTimeReport();
  }

  async clickWantedProject() {
    const projectId = '#b0p2o1187i0i1r1';
    await this.page.waitFor(projectId);
    await this.page.click(projectId);
  }

  async clickCreateReport() {
    const createReportBtn = '#b0p3o1211i0i0r1';
    await this.page.waitFor(createReportBtn);
    await this.page.click(createReportBtn);
  }

  async selectCategory() {
    const categoryMenu = '#b0p1o371i0i0r1';
    await this.page.waitFor(categoryMenu);
    await this.page.click(categoryMenu);

    await this.page.waitFor(1000);
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');
  }

  async addBillableHours() {
    const billableHours = 8;
    const hoursField = '#b0p1o388i0i0r1';
    await this.page.waitFor(hoursField);
    await this.page.click(hoursField);

    await this.page.waitFor(1000);
    await this.page.type(hoursField, billableHours.toString());
  }

  async selectTeam() {
    const teamMenu = '#b0p1o437i0i0r1';
    await this.page.waitFor(teamMenu);
    await this.page.click(teamMenu);
    await this.page.waitFor(1500);

    // Select the second element in the dropdown
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');
  }

  async addComment(comment = '- ') {
    const commentField = '#b0p1o374i0i0r1';
    await this.page.waitFor(commentField);
    await this.page.click(commentField);
    await this.page.type(commentField, comment);
    await this.page.waitFor(1000);
  }

  async saveTimeReport() {
    const saveTimeReportBtn = '#b0p2o442i0i0r1';
    await this.page.waitFor(saveTimeReportBtn);
    await this.page.click(saveTimeReportBtn);
  }

  async clickBtn(elem) {
    await this.addScripts();
    await this.page.evaluate((e) => {
      clickBtn(e);
    }, elem);
  }

  // Add helper functions to the DOM
  async addScripts() {
    await this.page.evaluate(() => {
      const clickBtn = (btn) => {
        const mouseDown = new MouseEvent('mousedown', {
          view: window,
          bubbles: true,
          cancelable: true
        });

        const mouseUp = new MouseEvent('mouseup', {
          view: window,
          bubbles: true,
          cancelable: true
        });

        btn.dispatchEvent(mouseDown);
        btn.dispatchEvent(mouseUp);
      };

      window.clickBtn = clickBtn;
    });
  }

  async getElemTopPosition(elem) {
    return await this.page.evaluate(elem => {
      const rect = elem.getBoundingClientRect();
      return rect.top + window.scrollY;
    }, elem);
  }

  async getScreenshotHeight() {
    try {
      const monthNow = capitalize(getMonth());
      const elem = (await this.page.$x(`//*[contains(text(), "${monthNow}")]`))[1];
      return await this.getElemTopPosition(elem);
    } catch (error) {
      await this.exit();
      errorMsg(`Can't get screenshot height on ${chalk.magenta(this.config.site)}.`);
    }
  }

  async takeScreenshot(filePath) {
    const screenshotHeight = await this.getScreenshotHeight();
    const screenshotSize = {
      height: screenshotHeight,
      width: 960,
      x: 30,
      y: 20,
    };

    await this.page.screenshot({
      path: filePath,
      clip: {
        ...screenshotSize
      },
    });
  }
}

module.exports = { NovaHandler };
