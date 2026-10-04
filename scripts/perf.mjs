/** Performance probe: paint timings, layout shift, DOM weight, transfer size. */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:4311";

const browser = await chromium.launch();

for (const route of ["/", "/services/electrical", "/process"]) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  let requests = 0;
  page.on("response", (r) => {
    requests++;
    if (r.status() >= 400) console.warn(`  ${r.status()} ${r.url()}`);
  });

  await page.addInitScript(() => {
    window.__cls = 0;
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
    }).observe({ type: "layout-shift", buffered: true });
  });

  await page.goto(BASE + route, { waitUntil: "load" });
  await page.waitForTimeout(2600);
  // Scroll the whole page to surface any shift caused by animations.
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += 900) {
    await page.evaluate((t) => window.scrollTo({ top: t, behavior: "instant" }), y);
    await page.waitForTimeout(160);
  }

  const m = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0];
    const paints = Object.fromEntries(
      performance.getEntriesByType("paint").map((p) => [p.name, Math.round(p.startTime)]),
    );
    const lcpEntries = performance.getEntriesByType("largest-contentful-paint");
    return {
      domNodes: document.getElementsByTagName("*").length,
      svgNodes: document.querySelectorAll("svg *").length,
      images: document.querySelectorAll("img").length,
      cls: Math.round((window.__cls ?? 0) * 1000) / 1000,
      fcp: paints["first-contentful-paint"],
      lcp: lcpEntries.length ? Math.round(lcpEntries[lcpEntries.length - 1].startTime) : null,
      domContentLoaded: Math.round(nav.domContentLoadedEventEnd),
      load: Math.round(nav.loadEventEnd),
    };
  });

  console.log(
    `${route.padEnd(22)} nodes ${String(m.domNodes).padStart(5)} · svg ${String(m.svgNodes).padStart(5)} · imgs ${m.images} · CLS ${m.cls} · FCP ${m.fcp}ms · LCP ${m.lcp}ms · DCL ${m.domContentLoaded}ms · load ${m.load}ms · req ${requests}`,
  );

  await ctx.close();
}

await browser.close();