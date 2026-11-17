import Lenis from './vendor/lenis.mjs';

import { motion } from './motion.js?v=motion28';
let lenis;

function syncDialogState() {
  if (!lenis) return;
  const blocked = !!document.querySelector('dialog[open]') || document.documentElement.classList.contains('preview-open');
  if (blocked) lenis.stop();
  else lenis.start();
}

function configure() {
  lenis?.destroy();
  lenis = undefined;
  if (motion.matches) return;
  lenis = new Lenis({
    autoRaf: true,
    respectReducedMotion: false,
    lerp: 0.16,
    smoothWheel: true,
    syncTouch: false,
    anchors: true,
    prevent: node => !!node.closest('dialog, [data-lenis-prevent]'),
  });
  syncDialogState();
}

// Remove reveal transforms before Lenis measures a navigation target.
document.addEventListener('click', event => {
  if (!lenis) return;
  const link = event.target.closest('a[href^="#"]');
  if (!link) return;
  const hash = link.getAttribute('href');
  if (hash.length <= 1) return;
  let id;
  try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
  const target = document.getElementById(id);
  if (target?.classList.contains('reveal-pending')) {
    target.classList.remove('reveal-pending');
    target.classList.add('in-view');
  }
}, { capture: true });

configure();
motion.addEventListener('change', configure);
const observer = new MutationObserver(syncDialogState);
observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
document.querySelectorAll('dialog').forEach(dialog => {
  observer.observe(dialog, { attributes: true, attributeFilter: ['open'] });
});
window.addEventListener('pagehide', () => { lenis?.destroy(); lenis = undefined; });
window.addEventListener('pageshow', event => { if (event.persisted) configure(); });
