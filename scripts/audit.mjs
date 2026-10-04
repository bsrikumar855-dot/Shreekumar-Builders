/**
 * Visual + runtime audit.
 *
 * Boots the production server, walks every route at four viewports, captures
 * screenshots at meaningful scroll positions, and reports console errors,
 * failed requests, horizontal overflow and console-message noise.
 *
 * Usage: node scripts/audit.mjs [baseUrl]
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.argv[2] ?? "http://localhost:4311";
const OUT = path.join(process.env.TEMP ?? ".", "sb-audit");

const VIEWPORTS = [
  { name: "desktop", width: 1600, height: 900 },
  { name: "laptop", width: 1280, height: 800 },
  { name: "tablet", width: 834, height: 1112 },
  { name: "mobile", width: 390, height: 844 },
];

const ROUTES = [
  { path: "/", shots: 11 },
  { path: "/services", shots: 3 },
  { path: "/services/electrical", shots: 3 },
  { path: "/projects", shots: 2 },
  { path: "/projects/project-01", shots: 4 },
  { path: "/process", shots: 3 },
  { path: "/about", shots: 4 },
  { path: "/contact", shots: 3 },
  { path: "/does-not-exist", shots: 1 },
];

fs.mkdirSync(OUT, { recursive: true });

const report = [];

const browser = await chromium.launch();

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
    hasTouch: vp.name === "mobile" || vp.name === "tablet",
  });

  for (const route of ROUTES) {
    const page = await context.newPage();
    const errors = [];
    const failed = [];

    page.on("console", (m) => {
      if (m.type() === "error" || m.type() === "warning") {
        errors.push(`[${m.type()}] ${m.text().slice(0, 300)}`);
      }
    });
    page.on("pageerror", (e) => errors.push(`[pageerror] ${e.message.slice(0, 300)}`));
    page.on("requestfailed", (r) =>
      failed.push(`${r.url()} — ${r.failure()?.errorText ?? "?"}`),
    );
    page.on("response", (r) => {
      if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
    });

    const res = await page.goto(`${BASE}${route.path}`, {
      waitUntil: "networkidle",
      timeout: 45000,
    });
    const status = res?.status() ?? 0;

    await page.waitForTimeout(2200); // let the intro settle

    const crashed = await page.evaluate(
      () => !!document.querySelector("nextjs-portal")?.textContent?.includes("Application error"),
    );
    if (crashed) errors.push("[fatal] client-side exception — page did not render");

    // Layout checks
    const layout = await page.evaluate(() => {
      const de = document.documentElement;
      const overflow = de.scrollWidth - de.clientWidth;
      const offenders = [];
      if (overflow > 1) {
        document.querySelectorAll("*").forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.width === 0) return;
          if (r.right > de.clientWidth + 2 || r.left < -2) {
            const cs = getComputedStyle(el);
            if (cs.position === "fixed") return;
            offenders.push(
              `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)} L${Math.round(r.left)} R${Math.round(r.right)}`,
            );
          }
        });
      }
      const h1 = Array.from(document.querySelectorAll("h1")).map((h) =>
        h.textContent.trim().slice(0, 70),
      );
      return {
        overflow,
        offenders: offenders.slice(0, 8),
        title: document.title,
        h1,
        imgNoAlt: Array.from(document.querySelectorAll("img")).filter(
          (i) => !i.hasAttribute("alt"),
        ).length,
      };
    });

    // Screenshots down the page
    const slug = route.path === "/" ? "home" : route.path.replace(/\//g, "-").replace(/^-/, "");
    const height = await page.evaluate(() => document.body.scrollHeight);
    const step = Math.max(1, Math.floor(height / route.shots));
    for (let i = 0; i < route.shots; i++) {
      const y = Math.min(i * step, Math.max(0, height - vp.height));
      await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
      await page.waitForTimeout(1100);
      await page.screenshot({
        path: path.join(OUT, `${vp.name}__${slug}__${String(i).padStart(2, "0")}.png`),
      });
    }

    report.push({ viewport: vp.name, route: route.path, status, layout, errors, failed });
    await page.close();
  }

  await context.close();
}

await browser.close();

fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));

let problems = 0;
for (const r of report) {
  const issues = [];
  if (r.status >= 400 && r.status !== 404) issues.push(`status ${r.status}`);
  if (r.layout.overflow > 1) issues.push(`overflow ${r.layout.overflow}px`);
  if (r.layout.imgNoAlt) issues.push(`${r.layout.imgNoAlt} img without alt`);
  if (r.errors.length) issues.push(`${r.errors.length} console msgs`);
  if (r.failed.length) issues.push(`${r.failed.length} failed requests`);
  if (issues.length) {
    problems++;
    console.log(`\n${r.viewport.padEnd(8)} ${r.route}`);
    console.log(`  ${issues.join(" · ")}`);
    r.errors.slice(0, 6).forEach((e) => console.log(`  ${e}`));
    r.failed.slice(0, 4).forEach((e) => console.log(`  FAIL ${e}`));
    if (r.layout.overflow > 1) r.layout.offenders.forEach((o) => console.log(`  ${o}`));
  }
}

console.log(`\nScreenshots + report: ${OUT}`);
console.log(problems === 0 ? "No layout/console problems detected." : `${problems} route/viewport combinations flagged.`);