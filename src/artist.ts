import * as cheerio from "cheerio";
import { ARTIST_URL } from "@/constant";
import { sleep } from "@/util";
import type { Page } from "puppeteer";

function getArtistUrl(artistId: number) {
    return ARTIST_URL.replace("{}", artistId.toString());
}

function parseArtworkIds(html: string) {
    const $ = cheerio.load(html);
    return Array.from(
        $("a.sc-d98f2c-0.sc-rp5asc-16.iUsZyY.sc-bdnxRM.fGjAxR")
            .map((_, el) => $(el).attr("href"))
    ).map(path => path.replace("/artworks/", ""));
}

export async function getArtistArtworks(page: Page, artistId: number) {
    const artistUrl = getArtistUrl(artistId);

    await page.goto(artistUrl);
    await page.setViewport({ width: 1920, height: 1080 });
    await sleep(1000 * 3);

    let p = 1;
    let artworks: string[] = [];
    let beforeIds: string[] = [];

    while (true) {
        console.log(`Fetching artist page ${p}...`);
        await page.goto(artistUrl + `?p=${p}`, { waitUntil: "networkidle0" });
        const html = await page.content();
        const ids = parseArtworkIds(html);

        if (ids.length == 0) break;

        let isDup = false;
        for (const id of ids) {
            if (beforeIds.includes(id)) {
                isDup = true;
                break;
            }
        }
        if (isDup) break;

        beforeIds = ids;
        artworks = [...artworks, ...ids];
        p++;
    }

    return artworks;
}
