import * as cheerio from "cheerio";
import { writeFile } from "fs/promises";
import { ARTWORK_DEFAULT_HEADERS, ARTWORK_URL } from "@/constant";
import { artworkDirectory, sleep } from "@/util";
import type { Page } from "puppeteer";

function getArtworkUrl(artworkId: string) {
    return ARTWORK_URL.replace("{}", artworkId);
}

function hasMoreButton(html: string) {
    const $ = cheerio.load(html);
    return $("button.sc-emr523-0.guczbC").length != 0;
}

function parseMultipleArtworkSourceUrls(html: string) {
    const $ = cheerio.load(html);
    return Array.from($("img.sc-1qpw8k9-1.eMdOSW").map((_, el) => $(el).attr("src")));
}

function parseArtworkSourceUrl(html: string): string {
    const $ = cheerio.load(html);
    return $("img.sc-1qpw8k9-1.eMdOSW").attr("src")!;
}

async function getArtworkSourceUrls(page: Page, artworkId: string) {
    const artworkUrl = getArtworkUrl(artworkId);
    await page.goto(artworkUrl, { waitUntil: "networkidle0" });
    const html = await page.content();

    let urls: string[];

    if (hasMoreButton(html)) {
        await (await page.$("button.sc-emr523-0.guczbC"))?.click();
        await sleep(1000);
        const openedHtml = await page.content();
        urls = parseMultipleArtworkSourceUrls(openedHtml);
    } else {
        urls = [parseArtworkSourceUrl(html)];
    }

    return urls;
}

export async function getBatchArtworkSourceUrls(page: Page, artworkIds: string[]) {
    let sourceURLs: string[] = [];

    for (let i = 0; i < artworkIds.length; i++) {
        const artworkId = artworkIds[i];
        try {
            console.log(`[${i + 1} / ${artworkIds.length}] Fetching artwork source URL... (Artwork ID: ${artworkId})`);
            const urls = await getArtworkSourceUrls(page, artworkId);
            sourceURLs = [...sourceURLs, ...urls];
        } catch (e) {
            console.error(`Error occurs while fetching artwork source URL. Skipping. (Artwork ID: ${artworkId})`);
            console.error(e);
        }
    }
    return sourceURLs.filter(s => s && typeof s == "string" && s != "");
}

async function downloadArtwork(url: string, filename: string) {
    const res = await fetch(url, {
        headers: ARTWORK_DEFAULT_HEADERS
    });

    const buffer = Buffer.from(await res.arrayBuffer());
    await writeFile(`./artworks/${filename}`, buffer);
}

export async function downloadBatchArtworks(urls: string[]) {
    await artworkDirectory();

    for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        try {
            const filename = url.split("/").pop()!;
            console.log(`[${i + 1} / ${urls.length}] Downloading artwork...\n\tURL: ${url}\n\t\tFilename: ${filename}`);
            await downloadArtwork(url, filename);
        } catch (e) {
            console.error(`Error occurs while downloading artwork. Skipping. (URL: ${url})`);
            console.error(e);
        }
    }
}
