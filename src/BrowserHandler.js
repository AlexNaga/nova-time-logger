const { errorMsg, successMsg, pageLog } = require('./lib/logHelper');
const { getEnvBool } = require('./lib/envHelper');
const { getFilePath } = require('./lib/fileHelper');
const { openImage } = require('./lib/openImage');
const chalk = require('chalk');
const puppeteer = require('puppeteer');

class BrowserHandler {
  constructor(url, username, password, config) {
    this.url = url;
    this.username = username;
    this.password = password;
    this.config = config;
    this.isDebug = getEnvBool('IS_DEBUG_MODE');
  }

  async init() {
    this.browser = await puppeteer.launch({
      headless: !this.isDebug,
      defaultViewport: {
        height: this.config.screen.height || 1200,
        width: this.config.screen.height || 1000
      }
      // slowMo: 250, // Time in ms
    });

    this.page = await this.browser.newPage();
    const shouldShowPageLog = getEnvBool('SHOW_CONSOLE_LOG');

    if (shouldShowPageLog) {
      this.page.on('console', (msg) => pageLog(`(${chalk.magenta('Nova')}) ${msg.text()}`));
    }
  }

  async takeScreenshot(filePath) {
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

module.exports = { BrowserHandler };
