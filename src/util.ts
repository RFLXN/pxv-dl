import { stat, mkdir } from "fs/promises";
import { createInterface } from "readline";

export async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function artworkDirectory() {
    let isExists = false;
    try {
        const s = await stat("artworks");
        if (s.isDirectory()) {
            isExists = true;
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (ignore) {
        // ignore
    }

    if (!isExists) {
        await mkdir("artworks");
    }
}

export async function readline(): Promise<string> {
    return new Promise((resolve) => {
        const rl = createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question("", (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}
