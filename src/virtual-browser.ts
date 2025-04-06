import { launch, Browser } from "puppeteer";

let browser: Browser | undefined;

// for singleton browser instance
export async function initBrowser() {
    browser = await launch({ headless: true });
}

export async function newPage() {
    if (!browser) {
        throw new Error("Browser not initialized.");
    }

    return browser.newPage();
}

export async function closeBrowser() {
    if (browser) {
        await browser.close();
        browser = undefined;
    }
}
