import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';

const baseURL = process.env.SHOWCASE_BASE_URL || 'http://127.0.0.1:4173/DOMO-BJI/';
const outDir = 'qa/showcase-v2';
mkdirSync(outDir, { recursive: true });

const targets = [
  { name: 'mobile-360', width: 360, height: 800 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'desktop-1366', width: 1366, height: 768 },
  { name: 'desktop-1920', width: 1920, height: 1080 }
];

const requiredProofs = ['Jair Neto', 'Criativo Design', 'Ferrini CrossFit', 'Fitaroni', 'Legado'];
const requiredRoutes = ['legado/', 'fitaroni/', 'demos/jair-neto/', 'demos/criativo-design/', 'demos/ferrini/'];
const results = [];
const browser = await chromium.launch({ headless: true });

try {
  for (const target of targets) {
    const context = await browser.newContext({ viewport: { width: target.width, height: target.height } });
    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];

    page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
    page.on('pageerror', (error) => pageErrors.push(error.message));

    const response = await page.goto(baseURL, { waitUntil: 'networkidle', timeout: 30000 });
    assert.equal(response?.status(), 200, `${target.name}: homepage não retornou 200`);
    await page.evaluate(() => document.fonts?.ready);

    const data = await page.evaluate((proofs) => {
      const root = document.documentElement;
      const body = document.body;
      const ctas = [...document.querySelectorAll('[data-cta="primary"]')].map((a) => a.href);
      const text = body.innerText;
      const images = [...document.images].map((img) => ({ src: img.currentSrc || img.src, loading: img.loading, complete: img.complete, width: img.naturalWidth }));
      const h1 = document.querySelector('h1');
      return {
        viewport: { width: window.innerWidth, height: window.innerHeight },
        overflow: Math.max(root.scrollWidth, body.scrollWidth) - root.clientWidth,
        h1: h1?.textContent?.trim() || '',
        ctas,
        proofs: Object.fromEntries(proofs.map((name) => [name, text.includes(name)])),
        images,
        mobileCtaVisible: getComputedStyle(document.querySelector('.mobile-cta')).display !== 'none'
      };
    }, requiredProofs);

    const imageStatuses = [];
    for (const image of data.images) {
      const imageResponse = await context.request.get(image.src);
      imageStatuses.push({ src: image.src, status: imageResponse.status(), loading: image.loading });
      assert.equal(imageResponse.status(), 200, `${target.name}: asset de imagem falhou ${image.src}`);
    }

    const eagerImages = data.images.filter((img) => img.loading !== 'lazy');
    assert.ok(eagerImages.every((img) => img.complete && img.width > 0), `${target.name}: imagem crítica não carregou`);
    assert.ok(data.h1.includes('Experiências e ferramentas comerciais'), `${target.name}: proposta principal não está clara`);
    assert.ok(data.overflow <= 1, `${target.name}: overflow horizontal de ${data.overflow}px`);
    assert.ok(data.ctas.length >= 3, `${target.name}: poucos CTAs primários`);
    assert.ok(data.ctas.every((href) => href.includes('wa.me/5522999686677')), `${target.name}: CTA fora do WhatsApp oficial`);
    assert.ok(Object.values(data.proofs).every(Boolean), `${target.name}: portfólio incompleto`);
    assert.equal(consoleErrors.length, 0, `${target.name}: console errors: ${consoleErrors.join(' | ')}`);
    assert.equal(pageErrors.length, 0, `${target.name}: page errors: ${pageErrors.join(' | ')}`);

    if (target.name === 'mobile-390') {
      await page.screenshot({ path: `${outDir}/mobile-390x844.jpg`, fullPage: true, type: 'jpeg', quality: 86 });
    }
    if (target.name === 'desktop-1366') {
      await page.screenshot({ path: `${outDir}/desktop-1366x768.jpg`, fullPage: true, type: 'jpeg', quality: 88 });
    }

    results.push({ ...target, ...data, imageStatuses, consoleErrors, pageErrors, pass: true });
    await context.close();
  }

  const reducedContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const reducedPage = await reducedContext.newPage();
  await reducedPage.goto(baseURL, { waitUntil: 'networkidle', timeout: 30000 });
  const reduced = await reducedPage.evaluate(() => ({
    media: matchMedia('(prefers-reduced-motion: reduce)').matches,
    allRevealVisible: [...document.querySelectorAll('.reveal')].every((node) => node.classList.contains('is-visible')),
    heroTransform: getComputedStyle(document.querySelector('.browser-frame-hero')).transform
  }));
  assert.equal(reduced.media, true, 'reduced-motion não foi emulado');
  assert.equal(reduced.allRevealVisible, true, 'conteúdo ficou preso em animação com reduced-motion');
  await reducedContext.close();

  const routeContext = await browser.newContext();
  const routeStatus = {};
  for (const route of requiredRoutes) {
    const response = await routeContext.request.get(new URL(route, baseURL).href);
    routeStatus[route] = response.status();
    assert.equal(response.status(), 200, `path protegido falhou: ${route} -> ${response.status()}`);
  }
  await routeContext.close();

  const report = {
    generatedAt: new Date().toISOString(),
    baseURL,
    viewports: results,
    reducedMotion: reduced,
    protectedRoutes: routeStatus,
    screenshots: [`${outDir}/mobile-390x844.jpg`, `${outDir}/desktop-1366x768.jpg`],
    status: 'PASS'
  };
  writeFileSync(`${outDir}/browser-qa.json`, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
