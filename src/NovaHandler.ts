import { BrowserHandler } from './BrowserHandler';
import { capitalize } from './lib/fileHelper';
import { ConfigInterface } from './types/ConfigInterface';
import { getDate, getMonth, getLastMonth } from './lib/dateHelper';
import { successMsg } from './lib/logHelper';
import chalk from 'chalk';

class NovaHandler extends BrowserHandler {
  config: ConfigInterface;

  constructor(config: ConfigInterface) {
    if (!config.url || !config.username || !config.password || !config.project) {
      throw new Error('Missing config, please check `.env.example`');
    }

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

    let shiftAlreadyExists = await this.isShiftAlreadyAdded();

    if (shiftAlreadyExists) {
      await this.exit();
      throw new Error(`Shift already exists in ${chalk.magenta(this.config.site)}.`);
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
    const dateNow = getDate('/');
    const pageTxt = await this.getPageTxt();
    let dateCount = (pageTxt.match(new RegExp(dateNow, 'g')) || []).length; // Count matches on page

    dateCount -= 1; // Since todays date is always visible on the site
    const isDateMismatch = dateCount < 0;

    if (isDateMismatch) {
      await this.exit();
      throw new Error(`The script doesn't match todays date on ${chalk.magenta(this.config.site)}.`);
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
      await this.page.waitFor(userField);
      await this.page.waitFor(pwField);
      await this.page.waitFor(loginBtn);
      await this.hasPageTxt('sign in');
    } catch (error) {
      await this.exit();
      throw new Error(`Can't open login page on ${chalk.magenta(this.config.site)}.`);
    }
  }

  async isSameDate() {
    try {
      const dateNow = getDate('/');
      await this.hasPageTxt(dateNow);
    } catch (error) {
      await this.exit();
      throw new Error(`The script doesn't match todays date on ${chalk.magenta(this.config.site)}.`);
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
    const addShiftBtn = '#b0p6o368i0i0r1';
    await this.page.waitFor(addShiftBtn);
    await this.page.click(addShiftBtn);

    const projectSelectionPage = '#b0p2o1181i0i0r1';
    await this.page.waitFor(projectSelectionPage);

    await this.clickWantedProject();
    await this.clickCreateReport();
    await this.selectCategory();
    await this.addBillableHours();
    await this.selectTeamMember();
    await this.addComment(this.config.message);
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
    await this.page.waitFor(1000);
    await this.page.keyboard.press('ArrowDown');
    await this.page.waitFor(500);
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');
  }

  async addBillableHours() {
    const billableHours = 8;
    await this.page.keyboard.press('Tab');
    await this.page.waitFor(1000);
    await this.page.keyboard.type(billableHours.toString());
  }

  async selectTeamMember() {
    await this.page.keyboard.press('Tab');
    await this.page.waitFor(1000);
    await this.page.keyboard.press('ArrowDown');
    await this.page.waitFor(1500);

    // Select the third element in the dropdown
    await this.page.keyboard.press('ArrowDown');
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
declare global {
  interface Window {
    clickBtn: any;
  }
}

declare let clickBtn: any; // Grus way of bypassing TS error

export { NovaHandler };
