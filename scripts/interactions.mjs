/**
 * Interaction-state captures: menu overlay, preloader, hover states,
 * reduced-motion, keyboard focus.
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.argv[2] ?? "http://localhost:4311";
const OUT = path.join(process.env.TEMP ?? ".", "sb-audit");
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

/* --- Menu overlay, desktop + mobile --- */
for (const vp of [
  { name: "desktop", width: 1600, height: 900 },
  { name: "mobile", width: 390, height: 844 },
]) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(2600);
  await page.getByRole("button", { name: /menu/i }).first().click();
  await page.waitForTimeout(1400);
  await page.screenshot({ path: path.join(OUT, `${vp.name}__menu-open.png`) });
  await ctx.close();
}

/* --- Preloader, captured mid-run --- */
{
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "commit" });
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(OUT, "desktop__preloader.png") });
  await ctx.close();
}

/* --- Hover state on the capability index --- */
{
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(2600);
  await page.evaluate(() => {
    const el = document.getElementById("capability-title");
    el?.scrollIntoView({ block: "start", behavior: "instant" });
  });
  await page.waitForTimeout(1400);
  await page.getByRole("link", { name: /Electrical/ }).first().hover();
  await page.waitForTimeout(1200);
  await page.mouse.move(1100, 500);
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(OUT, "desktop__capability-hover.png") });
  await ctx.close();
}

/* --- Services schedule hover --- */
{
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/services`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1600);
  await page.getByRole("link", { name: /Plumbing/ }).first().hover();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(OUT, "desktop__services-hover.png") });
  await ctx.close();
}

/* --- Reduced motion --- */
{
  const ctx = await browser.newContext({
    viewport: { width: 1600, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(OUT, "desktop__reduced-motion.png") });
  const cursorAttr = await page.evaluate(() => document.documentElement.dataset.customCursor);
  console.log("reduced-motion: custom cursor attr =", cursorAttr ?? "(none, correct)");
  await ctx.close();
}

/* --- Keyboard focus traversal --- */
{
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(2400);
  const seen = [];
  for (let i = 0; i < 14; i++) {
    await page.keyboard.press("Tab");
    seen.push(
      await page.evaluate(() => {
        const a = document.activeElement;
        return a ? `${a.tagName.toLowerCase()}:${(a.textContent ?? "").trim().slice(0, 28)}` : "none";
      }),
    );
  }
  console.log("tab order:", seen.join(" → "));
  await page.screenshot({ path: path.join(OUT, "desktop__focus.png") });
  await ctx.close();
}

await browser.close();
console.log("interaction captures written to", OUT);