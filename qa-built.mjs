import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const BUILT = "http://127.0.0.1:8081/";
const SHOTS = "D:\\workspace\\screenshots";
mkdirSync(SHOTS, { recursive: true });

const TABS = [
  ["1. Overview & HUD", "overview"],
  ["3. STM ULS", "stm"],
  ["4. Shear & Punching", "shear"],
  ["7. Calculation Report", "report"],
];

const verdict = { url: BUILT, viewports: {}, errors: [] };

function attach(page, vp) {
  page.on("console", (m) => {
    if (m.type() === "error") {
      const t = m.text();
      verdict.errors.push(`[${vp}] console: ${t}`);
      if (/MIME|Failed to load module script|import {*}/i.test(t)) verdict.mimeSymptoms = (verdict.mimeSymptoms || 0) + 1;
    }
  });
  page.on("pageerror", (e) => verdict.errors.push(`[${vp}] pageerror: ${String(e?.message || e)}`));
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

try {
  const browser = await chromium.launch({ headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });

  // DESKTOP: log in + walk pile-cap tabs on the BUILT bundle
  {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    attach(page, "desktop");
    await page.goto(BUILT, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForSelector('input[placeholder="str.design.test"]', { timeout: 20000 });
    await sleep(2200);
    await page.getByPlaceholder("str.design.test").fill("str.design.test");
    await page.getByPlaceholder("123!test").fill("123!test");
    await sleep(300);
    await page.getByRole("button", { name: /Login/i }).click();
    await page.getByText("Entering Platform... (Click to Continue)", { exact: true }).click({ timeout: 20000 });
    await page.getByRole("heading", { name: "Pile Cap Design", exact: true }).click({ timeout: 20000 });
    await sleep(1600);
    await page.screenshot({ path: join(SHOTS, "built-pilecap-overview.png") });

    for (const [label, slug] of TABS) {
      if (slug !== "overview") {
        await page.getByRole("button", { name: label }).click({ timeout: 20000 });
        await sleep(900);
        await page.screenshot({ path: join(SHOTS, `built-pilecap-${slug}.png`) });
      }
    }
    const body = await page.locator("body").innerText().catch(() => "");
    verdict.viewports.desktop = {
      status: 200,
      title: await page.title(),
      bodyTextLen: body.replace(/\s+/g, " ").trim().length,
      bodyTextPrefix: body.replace(/\s+/g, " ").trim().slice(0, 120),
      horizontalOverflow: await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1),
    };
    await page.close();
  }

  // MOBILE: landing + module on built bundle
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    attach(page, "mobile");
    await page.goto(BUILT, { waitUntil: "domcontentloaded", timeout: 60000 });
    const respCheck = await page.goto(BUILT, { waitUntil: "domcontentloaded", timeout: 60000 }).catch(() => null);
    void respCheck;
    await page.waitForSelector('input[placeholder="str.design.test"]', { timeout: 20000 });
    await sleep(2200);
    await page.getByPlaceholder("str.design.test").fill("str.design.test");
    await page.getByPlaceholder("123!test").fill("123!test");
    await sleep(300);
    await page.getByRole("button", { name: /Login/i }).click();
    await page.getByText("Entering Platform... (Click to Continue)", { exact: true }).click({ timeout: 20000 });
    await page.getByRole("heading", { name: "Pile Cap Design", exact: true }).click({ timeout: 20000 });
    await sleep(1600);
    await page.screenshot({ path: join(SHOTS, "built-pilecap-mobile.png") });
    verdict.viewports.mobile = {
      status: 200,
      bodyTextLen: (await page.locator("body").innerText().catch(() => "")).replace(/\s+/g, " ").trim().length,
      horizontalOverflow: await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1),
    };
    await page.close();
  }

  await browser.close();
} catch (err) {
  verdict.fatal = String(err?.message || err);
}

console.log(JSON.stringify(verdict, null, 2));