import { newPage } from "@/virtual-browser";
import { readline, sleep } from "@/util";

export async function loginPixiv() {
    const page = await newPage();

    console.log("Login page will be opened in 5 seconds.");
    console.log("Please login to Pixiv and press enter to continue.");
    await sleep(1000 * 3);
    await page.goto("https://accounts.pixiv.net/login?return_to=https%3A%2F%2Fwww.pixiv.net%2F&lang=ko&source=pc&view_type=page", { waitUntil: "networkidle0" });

    await readline(">>> Press enter after login to Pixiv... <<<");

    return page;
}
