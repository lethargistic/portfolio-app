import {createClient} from "@supabase/supabase-js";
import dotenv from 'dotenv';

import {chromium} from "playwright";

dotenv.config({ path: '../../../.env' })

const supabase = createClient(
    process.env.PUBLIC_SUPABASE_URL ?? (() => { throw new Error('bork url') })(),
    process.env.PUBLIC_SUPABASE_API_KEY ?? (() => { throw new Error('bork key') })()
);

const {data, error} = await supabase
    .from('web_projects_details')
    .select('name, link, link_github')

if (!data || error) {
    console.error(error);
}

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });

    if (data === null) {
        console.error('oh no');
    }

    let ix = 0;
    // @ts-ignore
    for (let proj of data) {
        await page.goto(proj.link ?? proj.link_github);
        await page.waitForURL(proj.link ?? proj.link_github);
        // it looks better sometimes
        await page.evaluate("document.body.style.zoom=1.25")
        await page.waitForTimeout(1000);
        await page.screenshot({path: `screenshots/${proj.name}.png`});
        ix++;
    }

    console.log(`Screenshotted ${ix} sites`)

    await browser.close();
})();