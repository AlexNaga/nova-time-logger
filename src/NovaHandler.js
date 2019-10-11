require('dotenv').config();
const chalk = require('chalk');
const puppeteer = require('puppeteer');
const { errorMsg, successMsg, pageLog } = require('./lib/logHelper');
const { capitalize, getFilePath } = require('./lib/fileHelper');
const { getDate, getMonth, getWeekday } = require('./lib/dateHelper');
const { openImage } = require('./lib/openImage');

const { env } = process;

class NovaHandler {
  constructor() {
    this.url = env.NOVA_URL;
    this.username = env.NOVA_USERNAME;
    this.password = env.NOVA_PASSWORD;
    this.debug = env.IS_DEBUG_MODE;
    this.showConsoleLog = env.SHOW_CONSOLE_LOG;
    this.shiftsAddedCount = 0;
  }

  async init() {
    this.browser = await puppeteer.launch({
      headless: !this.debug,
      defaultViewport: {
        height: 1200,
        width: 1000
      }
      // slowMo: 250, // Time in ms
    });

    this.page = await this.browser.newPage();

    if (this.showConsoleLog) {
      this.page.on('console', (msg) => pageLog(`(${chalk.magenta('Nova')}) ${msg.text()}`));
    }
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
      errorMsg(`Shift already exists in ${chalk.magenta('Nova')}.`);
    }

    while (shiftAlreadyExists === false) {
      await this.addShift();
      this.shiftsAddedCount += 1;
      await this.waitForTimeReportPage();
      shiftAlreadyExists = await this.isShiftAlreadyAdded();
    }

    successMsg(`Added shift to ${chalk.magenta('Nova')}.`);
    await this.exit();
  }

  async isShiftAlreadyAdded() {
    const allTxtContent = await this.page.$$('.text');
    const dateNow = getDate('/');
    let count = 0;

    for (const elem of allTxtContent) {
      const label = await this.page.evaluate((e) => e.textContent.toLowerCase(), elem);
      const dateExists = label.includes(dateNow);

      if (dateExists) {
        count += 1;
      }
    }

    count -= 1; // Since the date is always visible on the site

    if (count < 0) {
      await this.exit();
      errorMsg(`The script doesn't match todays date on ${chalk.magenta('Nova')}.`);
    }

    const isFriday = getWeekday() === 'friday';

    // If less than three shifts on friday, add more
    if (isFriday && count < 3) {
      return false;
    }

    // Shift exists
    if (count >= 1) {
      return true;
    }
    return false; // Shift doesn't exist
  }

  async login(user, pw) {
    const userField = '#login_name';
    const pwField = '#login_pwd';
    const loginBtn = '#login_nonguest';

    await this.waitForLoginPage();
    await this.page.type(userField, user);
    await this.page.type(pwField, pw);
    await this.page.click(loginBtn);
  }

  async waitForLoginPage() {
    const userField = '#login_name';
    const pwField = '#login_pwd';
    const loginBtn = '#login_nonguest';

    try {
      await this.page.waitFor(userField);
      await this.page.waitFor(pwField);
      await this.page.waitFor(loginBtn);
      await this.hasPageTxt('sign in');
    } catch (error) {
      await this.exit();
      errorMsg(`Can\'t open login page on ${chalk.magenta('Nova')}.`);
    }
  }

  async isSameDate() {
    try {
      const dateNow = getDate('/');
      await this.hasPageTxt(dateNow);
    } catch (error) {
      await this.exit();
      errorMsg(`The script doesn't match todays date on ${chalk.magenta('Nova')}.`);
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
      const monthNow = getMonth(); // This only exists on time report page
      await this.hasPageTxt(monthNow);
    } catch (error) {
      await this.exit();
      errorMsg(`Can\'t open time reports page on ${chalk.magenta('Nova')}.`);
    }
  }

  async hasPageTxt(searchTxt) {
    return await this.page.waitForFunction(searchTxt => {
      const txtOnPage = document.querySelector('body').innerText.toLowerCase();
      return txtOnPage.includes(searchTxt);
    }, {}, searchTxt);
  }

  async addShift() {
    const addShiftBtn = '#b0p6o328i0i0r1';
    await this.page.waitFor(addShiftBtn);
    await this.page.click(addShiftBtn);

    const projectSelection = '#b0p2o1181i0i0r1';
    await this.page.waitFor(projectSelection);
    await this.page.click(projectSelection);

    await this.clickWantedProject();
    await this.clickCreateReport();
    await this.selectCategory();
    await this.addBillableHours();
    await this.selectTeam();
    await this.addComment(env.MESSAGE);
    await this.saveTimeReport();
  }

  async clickWantedProject() {
    const projectMenu = '.menu_option';
    await this.page.waitFor(projectMenu);

    const searchTxt = 'SO42940';
    this.selectMenuItemByTxt(projectMenu, searchTxt);
  }

  async clickCreateReport() {
    const createReportBtn = '#b0p2o1208i0i0r1';
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
    const hoursField = '#b0p1o388i0i0r1';
    await this.page.waitFor(hoursField);
    await this.page.click(hoursField);

    let billableHours = 8;
    const isFriday = getWeekday() === 'friday';

    if (isFriday) {
      if (this.shiftsAddedCount === 0) {
        billableHours = 4;
      } else {
        billableHours = 2;
      }
    }

    await this.page.waitFor(1000);
    await this.page.type(hoursField, billableHours.toString());
  }

  async selectTeam() {
    const teamMenu = '#b0p1o437i0i0r1';
    await this.page.waitFor(teamMenu);
    await this.page.click(teamMenu);

    const weekday = getWeekday();
    const isMonday = weekday === 'monday';
    const isTuesday = weekday === 'tuesday';
    const isWednesday = weekday === 'wednesday';
    const isThursday = weekday === 'thursday';
    const isFriday = weekday === 'friday';

    await this.page.waitFor(1500);
    await this.page.keyboard.press('ArrowDown');

    if (isMonday || isTuesday) {
      await this.page.keyboard.press('ArrowDown');
    }

    if (isWednesday || isThursday) {
      await this.page.keyboard.press('ArrowDown');
      await this.page.keyboard.press('ArrowDown');
    }

    if (isFriday) {
      if (this.shiftsAddedCount === 1) {
        await this.page.keyboard.press('ArrowDown');
      } else if (this.shiftsAddedCount === 2) {
        await this.page.keyboard.press('ArrowDown');
        await this.page.keyboard.press('ArrowDown');
      }
    }

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
    const saveTimeReportBtn = '#b0p2o431i0i0r1';
    await this.page.waitFor(saveTimeReportBtn);
    await this.page.click(saveTimeReportBtn);
  }

  // Loop through the menu items and find a match
  async selectMenuItemByTxt(menuId, searchTxt) {
    const menuItems = await this.page.$$(menuId);

    // Loop over the menu items and click the one we want
    for (const menuItem of menuItems) {
      const label = await this.page.evaluate((elem) => elem.textContent.toLowerCase(), menuItem);
      const isWantedItem = label.includes(searchTxt.toLowerCase());

      if (isWantedItem) {
        await this.clickBtn(menuItem);
      }
    }
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
      errorMsg(`Can't get screenshot height on ${chalk.magenta('Nova')}.`);
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

  async closeBrowser() {
    await this.browser.close();
  }

  async exit() {
    const filePath = getFilePath('nova');
    await this.takeScreenshot(filePath);
    await openImage(filePath);
    await this.closeBrowser();
  }
}

module.exports = { NovaHandler };
