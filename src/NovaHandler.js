require('dotenv').config();
const { errorMsg, infoMsg, successMsg, pageLog } = require('./lib/logHelper');
const { getFilePath } = require('./lib/fileHelper');
const { openImage } = require('./lib/openImage');
const chalk = require('chalk');
const puppeteer = require('puppeteer');
const env = process.env;
const isDebugMode = env.IS_DEBUG_MODE === 'true' ? true : false;

class NovaHandler {
  constructor() {
    this.url = env.NOVA_URL;
    this.username = env.NOVA_USERNAME;
    this.password = env.NOVA_PASSWORD;
    this.debug = isDebugMode;
  }

  async init() {
    this.browser = await puppeteer.launch({
      headless: !this.debug,
      // slowMo: 250, // Time in ms
    });

    this.page = await this.browser.newPage();

    if (this.debug) {
      // this.page.on('console', msg => pageLog(`(${chalk.cyan('Nova')}) ${msg.text()}`));
    }
  }

  async run() {
    await this.init();
    await this.page.goto(this.url);
    await this.login(this.username, this.password);
    await this.page.waitForNavigation();

    await this.clickTimeReportsTab();
    await this.addShift();

    // const timeoutInMs = 2000;
    // let shiftAlreadyExists = false;

    // try {
    //   // If this element gets hidden the shift was successfully added
    //   await this.page.waitFor('.work-shift-admin', { hidden: true, timeout: timeoutInMs });
    // } catch (error) {
    //   shiftAlreadyExists = true;
    // }

    // if (shiftAlreadyExists) {
    //   errorMsg(`Shift already exists in ${chalk.cyan('Nova')}.`);
    // } else {
    //   await this.page.waitFor(200);
    //   successMsg(`Added shift to ${chalk.cyan('Nova')}.`);
    // }

    // const filePath = getFilePath();
    // await this.takeScreenshot(filePath);
    // await openImage(filePath);

    // this.closeBrowser();
  }

  async login(user, pw) {
    const userField = '#login_name';
    const pwField = '#login_pwd';
    const loginBtn = '#login_nonguest';

    await this.page.waitFor(userField);
    await this.page.waitFor(500);
    await this.page.type(userField, user);

    await this.page.waitFor(pwField);
    await this.page.type(pwField, pw);

    await this.page.waitFor(loginBtn);
    await this.page.click(loginBtn);
  };

  async clickTimeReportsTab() {
    const timeReportsTab = '#b0p1o331i0i0r1';
    await this.page.waitFor(timeReportsTab);
    await this.page.click(timeReportsTab);
  };


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
    await this.addBillableHours(8);
  };

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

    await this.page.waitFor(300);
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');
  }

  async addBillableHours(billableHours) {
    const hoursField = '#b0p1o388i0i0r1';
    await this.page.waitFor(hoursField);
    await this.page.click(hoursField);
    
    await this.page.waitFor(500);
    await this.page.type(hoursField, billableHours.toString());
  }

  async selectMenuItemByTxt(menuId, searchTxt) {
    const menuItems = await this.page.$$(menuId);

    this.addScripts();

    // Loop over the menu items and click the one we want
    for (const menuItem of menuItems) {
      const label = await this.page.evaluate(elem => elem.textContent.toLowerCase(), menuItem);
      const isWantedItem = label.includes(searchTxt.toLowerCase());

      if (isWantedItem) {
        await this.page.evaluate(elem => {
          clickBtn(elem)
        }, menuItem);
      }
    }
  }

  // Add helper functions to the DOM
  async addScripts() {
    await this.page.evaluate(() => {
      const clickBtn = (btn) => {
        const mouseDown = new MouseEvent('mousedown', {
          view: window,
          bubbles: true,
          cancelable: true,
        });

        const mouseUp = new MouseEvent('mouseup', {
          view: window,
          bubbles: true,
          cancelable: true,
        });

        btn.dispatchEvent(mouseDown);
        btn.dispatchEvent(mouseUp);
      };

      window.clickBtn = clickBtn;
    });
  }

  async closeBrowser() {
    await this.browser.close();
  }
}

module.exports = { NovaHandler };