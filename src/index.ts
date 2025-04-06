import "@/env";
import { closeBrowser, initBrowser, newPage } from "@/virtual-browser";
import { downloadBatchArtworks, getBatchArtworkSourceUrls } from "@/artwork";
import { getArtistArtworks } from "@/artist";
import { readline } from "@/util";
import { loginPixiv } from "@/pixiv-login";
import type { Page } from "puppeteer";

void (async () => {
    process.on("exit", () => {
        void closeBrowser();
    });

    console.log("Did you using headless mode?");
    console.log("\tHeadless mode: Virtual browser mode. (Did not open actual browser window)");
    console.log("\tIf you using headless mode, you can not login to Pixiv");

    const isHeadless = (await readline("(y/n)")).trim().toLowerCase() === "y";

    let page: Page;
    if (isHeadless) {
        await initBrowser(true);
        page = await newPage();
    } else {
        await initBrowser(false);

        console.log("Did you login to Pixiv?");
        console.log("\tIf you login to Pixiv, you can download more artworks. (ex: R-18)");
        const isLogin = (await readline("(y/n)")).trim().toLowerCase() === "y";

        if (isLogin) {
            page = await loginPixiv();
        } else {
            page = await newPage();
        }
    }

    const artistId = Number(await readline("Please type artist ID to download all artworks: "));

    console.log(`Fetching artist artworks... (Artist ID: ${artistId})`);
    const artworkIDs = await getArtistArtworks(page, artistId);
    console.log(`Artist artworks fetched: Every ${artworkIDs.length} artworks.`);

    console.log("Fetching artwork source URLs...");
    const artworkSourceURLs = await getBatchArtworkSourceUrls(page, artworkIDs);
    console.log("Artwork source URLs fetched.");

    console.log("Downloading artworks...");
    await downloadBatchArtworks(artworkSourceURLs);
    console.log("All artworks downloaded! Exiting...");

    process.exit();
})();
