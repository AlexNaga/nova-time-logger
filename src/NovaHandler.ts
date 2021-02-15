import { BrowserHandler } from './BrowserHandler';
import { capitalize } from './lib/fileHelper';
import { Config, validateInt } from './lib/Config';
import { getDate, getMonth, getLastMonth, getDaysOfThisWeek, getWeekNr } from './lib/dateHelper';
import { successMsg } from './lib/logHelper';
import chalk from 'chalk';

class NovaHandler extends BrowserHandler {
  config: Config;

  constructor(config: Config) {
    super(config);
    this.config = config;
  }

  async run() {
    await this.init();
    await this.page.goto(this.url);
    await this.login(this.username, this.password);
    await this.page.waitForNavigation();

    await this.isSameDate();
    await this.clickTimeReportPage();

    if (this.config.week) {
      const { monday, friday } = getDaysOfThisWeek('/');

      if (monday.month !== friday.month) {
        // TODO: Here we should instead create individual time reports for the week
        await this.exit();
        throw new Error('Reporting time over several months is not yet supported.');
      }

      const shiftAlreadyExists = await this.isShiftAlreadyAdded(friday.date);

      if (shiftAlreadyExists) {
        await this.exit();
        const weekNr = getWeekNr(this.config.days);
        throw new Error(`Already reported for week ${weekNr} in ${chalk.magenta(this.config.site)}.`);
      }

      await this.addShift();
      await this.waitForTimeReportPage();

    } else {
      const dateToCheck = getDate({ divider: '/', days: this.config.days });
      const shiftAlreadyExists = await this.isShiftAlreadyAdded(dateToCheck);

      if (shiftAlreadyExists) {
        await this.exit();
        throw new Error(`${dateToCheck}: Shift already exists in ${chalk.magenta(this.config.site)}.`);
      }

      await this.addShift();
      await this.waitForTimeReportPage();
    }

    successMsg(`Added shift to ${chalk.magenta(this.config.site)}.`);
    await this.exit();
  }

  async isShiftAlreadyAdded(dateToCheck: string) {
    const todaysDate = getDate({ divider: '/' });
    const pageTxt = await this.getPageTxt();
    let dateCount = (pageTxt.match(new RegExp(dateToCheck, 'g')) || []).length; // Count matches on page

    if (todaysDate === dateToCheck) {
      dateCount -= 1; // Since todays date is always visible on the site
    }

    const isDateMismatch = dateCount < 0;

    if (isDateMismatch) {
      await this.exit();
      throw new Error(`Is date mismatch on ${chalk.magenta(this.config.site)}.`);
    }

    const doesShiftExist = dateCount > 0;
    return doesShiftExist ? true : false;
  }

  async login(user: string, pw: string) {
    const userField = '#login_name';
    const pwField = '#login_pwd';
    const loginBtn = '#login_nonguest';

    await this.waitForLoginPage(userField, pwField, loginBtn);
    await this.page.type(userField, user);
    await this.page.type(pwField, pw);
    await this.page.click(loginBtn);
  }

  async waitForLoginPage(userField: string, pwField: string, loginBtn: string) {
    try {
      await this.page.waitForSelector(userField, { visible: true });
      await this.page.waitForSelector(pwField, { visible: true });
      await this.page.waitForSelector(loginBtn, { visible: true });
    } catch (error) {
      await this.exit();
      throw new Error(`Can't open login page on ${chalk.magenta(this.config.site)}.`);
    }
  }

  async isSameDate() {
    try {
      const dateNow = getDate({ divider: '/' });
      await this.hasPageTxt(dateNow);
    } catch (error) {
      await this.exit();
      throw new Error(`The script doesn't match todays date on ${chalk.magenta(this.config.site)}.`);
    }
  }

  async clickTimeReportPage() {
    await this.waitAndClickBtnWithTxt('TIME REPORTING');
    await this.waitForTimeReportPage();
  }

  async waitForTimeReportPage() {
    try {
      const lastMonth = getLastMonth(); // This only exists on time report page
      await this.hasPageTxt(lastMonth);

    } catch (error) {
      await this.exit();
      throw new Error(`Can't open time reports page on ${chalk.magenta(this.config.site)}.`);
    }
  }

  async hasPageTxt(searchTxt: string) {
    return await this.page.waitForFunction((searchTxt: string) => {
      const body = document.querySelector('body');
      let txtOnPage = '';

      if (body) {
        txtOnPage = body.innerText.toLowerCase();
      }

      return txtOnPage.includes(searchTxt);
    }, {}, searchTxt);
  }

  async addShift() {
    await this.waitAndClickBtnWithTxt('CREATE NEW TIME REPORT');

    const projectSelectionPage = '.v-verticallayout-iwps_portal'; // This seems to only exist on this page
    await this.page.waitForSelector(projectSelectionPage);

    await this.clickWantedProject();
    await this.clickCreateReport();
    await this.selectCategory();
    await this.addBillableHours(this.config.hours);
    await this.selectIoNumber();
    await this.addComment(this.config.message);
    await this.addDate(this.config.days, this.config.week);
    await this.saveTimeReport();
  }

  async clickWantedProject() {
    try {
      const projectId = await this.getProjectElemID() as string;
      await this.page.waitForSelector(projectId);
      await this.page.click(projectId);
    } catch (error) {
      await this.exit();
      throw new Error(`Could not find project "${this.config.project}" on ${chalk.magenta(this.config.site)}.`);
    }
  }

  async getProjectElemID() {
    // TODO: Wait for text on page instead
    await this.page.waitForTimeout(1000);

    const ids = await this.page.$$eval('.text', (elem, project) => elem
      .filter(elem => elem.textContent?.includes(project))
      .map(elem => elem.parentElement?.parentElement?.parentElement?.firstElementChild?.id), this.config.project);
    return `#${ids[0]}`;
  }

  async clickCreateReport() {
    await this.waitAndClickBtnWithTxt('CREATE REPORT');
  }

  async selectCategory() {
    await this.page.waitForTimeout(1000);
    await this.page.keyboard.press('ArrowDown');
    await this.page.waitForTimeout(500);
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');
  }

  async addBillableHours(hours: number) {
    await this.page.keyboard.press('Tab');
    await this.page.waitForTimeout(1000);
    await this.page.keyboard.type(hours.toString());
  }

  async selectIoNumber() {
    const hasSetIoNumber = validateInt(this.config.ioNumber);
    await this.page.keyboard.press('Tab');
    await this.page.waitForTimeout(1000);
    await this.page.keyboard.press('ArrowDown');
    await this.page.waitForTimeout(1500);
    await this.page.keyboard.press('ArrowDown');
    await this.page.waitForTimeout(1000);

    const checkIfFound = async () => {
      const itemTxt = await this.page.$eval('.focus', node => (<HTMLElement>node).innerText);
      return itemTxt.toUpperCase().includes(this.config.ioNumber);
    };

    let isFound = await checkIfFound();
    const startTime = Date.now();
    const timeLimitInMs = 10000;

    // Continue after time limit
    while (!isFound && Date.now() - startTime < timeLimitInMs) {
      await this.page.waitForTimeout(500);
      await this.page.keyboard.press('ArrowDown');
      isFound = await checkIfFound();
    }

    await this.page.keyboard.press('Enter');

    const validateIoNumber = async () => {
      const itemTxt = await this.page.$eval('.focused', node => (<HTMLElement>node).innerText);
      const isCorrectIoNumber = itemTxt.includes(this.config.ioNumber);

      if (!isCorrectIoNumber) {
        await this.browser.close();
        throw new Error(`The selected IO Number is wrong on ${chalk.magenta(this.config.site)}.`);
      }
    };

    if (hasSetIoNumber) await validateIoNumber();
  }

  async addComment(comment = '- ') {
    const commentFieldXPath = '//div[contains(@class, "placeholder") and contains(text(), "activities")]';
    await this.waitAndClickXPath(commentFieldXPath);
    await this.page.keyboard.type(comment);
    await this.page.waitForTimeout(1000);
  }

  async addDate(days = 0, reportForWeek: boolean) {
    await this.page.keyboard.press('Tab');
    await this.page.waitForTimeout(1000);
    let todaysDate: string;
    const { monday, friday } = getDaysOfThisWeek('/');

    if (reportForWeek) {
      await this.page.keyboard.type(monday.date);
    } else {
      todaysDate = getDate({ divider: '/', days });
      await this.page.keyboard.type(todaysDate);
    }

    await this.page.keyboard.press('Tab');
    await this.page.waitForTimeout(1000);

    if (reportForWeek) {
      await this.page.keyboard.type(friday.date);
    } else {
      await this.page.keyboard.type(todaysDate!);
    }
  }

  async saveTimeReport() {
    await this.waitAndClickBtnWithTxt('SAVE');
  }

  async clickBtn(elem: any) {
    await this.addScripts();
    await this.page.evaluate((e: any) => {
      clickBtn(e);
    }, elem);
  }

  async getPageTxt() {
    let pageTxt = await this.page.$eval('*', (e: any) => e.innerText);
    pageTxt = pageTxt.replace(/\s\s+/g, ' '); // Remove whitespace to make it nice and clean
    return pageTxt;
  }

  // Add helper functions to the DOM
  async addScripts() {
    await this.page.evaluate(() => {
      const clickBtn = (btn: any) => {
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

  async getElemTopPosition(elem: any) {
    return await this.page.evaluate((e: any) => {
      const rect = e.getBoundingClientRect();
      return rect.top + window.scrollY;
    }, elem);
  }

  async getScreenshotHeight() {
    try {
      const monthNow = capitalize(getMonth());
      const elem: any = (await this.page.$x(`//*[contains(text(), "${monthNow}")]`))[1];
      return await this.getElemTopPosition(elem);
    } catch (error) {
      await this.exit();
      throw new Error(`Can't get screenshot height on ${chalk.magenta(this.config.site)}.`);
    }
  }

  async takeScreenshot(filePath: string) {
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

// This is needed to extend `window`
// eslint-disable-next-line no-unused-vars
declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    clickBtn: any;
  }
}

declare let clickBtn: any; // Grus way of bypassing TS error

export { NovaHandler };
