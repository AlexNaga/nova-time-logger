import { env } from './lib/setup';
import { Config } from './types/config';
import { getFilePath } from './lib/fileHelper';
import { openImage } from './lib/openImage';
import { pageLog } from './lib/logHelper';
import chalk from 'chalk';
import puppeteer from 'puppeteer';

export class BrowserHandler {
  url: string;
  username: string;
  password: string;
  config: Config;
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
      headless: !env.IS_DEBUG,
      defaultViewport: {
        height: screenHeight,
        width: screenWidth
      }
      // slowMo: 250, // Time in ms
    });

    this.page = await this.browser.newPage();

    if (env.SHOW_LOGS) {
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
