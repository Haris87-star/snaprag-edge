/**
 * SnapRAG Mobile UX & PWA Verification Test Suite
 * Validates mobile-specific elements, bottom nav, citation drawer closability, safe-area insets, and PWA assets.
 */

import fs from 'fs';
import path from 'path';

console.log("==================================================================");
console.log("📱 STARTING SNAPRAG MOBILE UX & PWA VERIFICATION TEST SUITE");
console.log("==================================================================");

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    console.log(`✓ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`✗ [FAIL] ${message}`);
    process.exit(1);
  }
}

// 1. Check index.html mobile meta and markup
const indexHtml = fs.readFileSync('index.html', 'utf-8');
assert(indexHtml.includes('viewport-fit=cover'), 'index.html contains viewport-fit=cover for device notch handling');
assert(indexHtml.includes('theme-color'), 'index.html contains theme-color meta tag');
assert(indexHtml.includes('manifest.json'), 'index.html links to PWA manifest.json');
assert(indexHtml.includes('id="mobile-bottom-nav"'), 'index.html contains mobile-bottom-nav');
assert(indexHtml.includes('id="citation-backdrop"'), 'index.html contains citation-backdrop overlay');
assert(indexHtml.includes('id="close-drawer-bottom-btn"'), 'index.html contains mobile close-drawer-bottom-btn');
assert(indexHtml.includes('id="mobile-menu-toggle-btn"'), 'index.html contains mobile-menu-toggle-btn');

// 2. Check PWA assets
assert(fs.existsSync('public/manifest.json'), 'public/manifest.json exists');
const manifest = JSON.parse(fs.readFileSync('public/manifest.json', 'utf-8'));
assert(manifest.display === 'standalone', 'PWA manifest configured for standalone full-screen display');
assert(manifest.theme_color === '#07090e', 'PWA manifest theme_color matches Qualcomm dark theme');

assert(fs.existsSync('public/sw.js'), 'public/sw.js offline service worker exists');
const swContent = fs.readFileSync('public/sw.js', 'utf-8');
assert(swContent.includes('CACHE_NAME'), 'Service worker contains cache management');
assert(swContent.includes('addEventListener(\'fetch\''), 'Service worker intercepts fetch requests for offline support');

// 3. Check CSS Mobile Rules in src/styles/main.css
const mainCss = fs.readFileSync('src/styles/main.css', 'utf-8');
assert(mainCss.includes('safe-area-inset-top'), 'CSS utilizes env(safe-area-inset-top) for top notch clearance');
assert(mainCss.includes('safe-area-inset-bottom'), 'CSS utilizes env(safe-area-inset-bottom) for home indicator clearance');
assert(mainCss.includes('.mobile-bottom-nav'), 'CSS defines .mobile-bottom-nav layout and active states');
assert(mainCss.includes('.citation-backdrop'), 'CSS defines .citation-backdrop overlay');
assert(mainCss.includes('transform: translateY(100%)'), 'Citation drawer on mobile uses slide-up transform');
assert(mainCss.includes('transform: translateY(0%)'), 'Citation drawer on mobile opens via transform slide-up');
assert(mainCss.includes('z-index: 1000'), 'Citation drawer on mobile has priority z-index: 1000 above header');

// 4. Check app.js event wiring
const appJs = fs.readFileSync('src/app.js', 'utf-8');
assert(appJs.includes('this.citationBackdrop?.addEventListener("click"'), 'app.js wires backdrop click to close citation drawer');
assert(appJs.includes('this.closeDrawerBottomBtn?.addEventListener("click"'), 'app.js wires bottom close button to close citation drawer');
assert(appJs.includes('this.mobileMenuToggleBtn?.addEventListener("click"'), 'app.js wires mobile quick menu toggle');
assert(appJs.includes('navItems.forEach'), 'app.js wires mobile bottom navigation tab switching');
assert(appJs.includes('navigator.serviceWorker.register'), 'app.js registers PWA service worker');

console.log("==================================================================");
console.log(`🎉 ALL ${passed}/${total} MOBILE UX & PWA TESTS PASSED WITH ZERO ERRORS!`);
console.log("==================================================================");
