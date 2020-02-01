import { getEnvBool } from './lib/envHelper';
import { getFilePath } from './lib/fileHelper';
import { openImage } from './lib/openImage';
import { pageLog } from './lib/logHelper';
import { Config } from './types/config';
import chalk from 'chalk';
import puppeteer from 'puppeteer';

class BrowserHandler {
  url: string;
  username: string;
  password: string;
  config: Config;
  isDebug: boolean;
  browser!: puppeteer.Browser;
  page!: puppeteer.Page;

  constructor(config: Config) {
    if (!config.screen) {
      config.screen = {};
    }

    this.url = config.url;
    this.username = config.username;
    this.password = config.password;
    this.config = config;
    this.isDebug = getEnvBool('is_debug');
  }

  async init() {
    let screenHeight = 1200;
    let screenWidth = 1000;
    const screen = this.config.screen;

    if (screen && screen.height && screen.width) {
      screenHeight = screen.height;
      screenWidth = screen.width;
    }

    this.browser = await puppeteer.launch({
      headless: !this.isDebug,
      defaultViewport: {
        height: screenHeight,
        width: screenWidth
      }
      // slowMo: 250, // Time in ms
    });

    this.page = await this.browser.newPage();
    const shouldShowPageLog = getEnvBool('show_console_log');

    if (shouldShowPageLog) {
      this.page.on('console', (msg) => pageLog(`(${chalk.magenta(this.config.site)}) ${msg.text()}`));
    }
  }

  async takeScreenshot(filePath: string) { }

  async closeBrowser() {
    await this.browser.close();
  }

  async exit() {
    const filePath = getFilePath(this.config.site);
    await this.takeScreenshot(filePath);
    await openImage(filePath);
    await this.closeBrowser();
  }

}

export { BrowserHandler };
