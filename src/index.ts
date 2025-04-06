import "@/env";
import { closeBrowser, initBrowser } from "@/virtual-browser";
import { downloadBatchArtworks, getBatchArtworkSourceUrls } from "@/artwork";
import { getArtistArtworks } from "@/artist";
import { readline } from "@/util";

void (async () => {
    process.on("exit", () => {
        void closeBrowser();
    });

    console.log("Please type artist ID to download all artworks:");
    const artistId = Number(await readline());

    console.log("Initializing Virtual Browser...");
    await initBrowser();
    console.log("Virtual Browser Initialized.");

    console.log(`Fetching artist artworks... (Artist ID: ${artistId})`);
    const artworkIDs = await getArtistArtworks(artistId);
    console.log(`Artist artworks fetched: Every ${artworkIDs.length} artworks.`);

    console.log("Fetching artwork source URLs...");
    const artworkSourceURLs = await getBatchArtworkSourceUrls(artworkIDs);
    console.log("Artwork source URLs fetched.");

    console.log("Downloading artworks...");
    await downloadBatchArtworks(artworkSourceURLs);
    console.log("All artworks downloaded! Exiting...");

    process.exit();
})();
