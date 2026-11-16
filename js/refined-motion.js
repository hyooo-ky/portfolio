// Optional visual details: content remains visible without this module.
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
let cleanup = () => {};

function configureMotion() {
  cleanup();
  if (reduced.matches) return;
  const animations = new Set();
  const root = document.documentElement;
  root.classList.add('refined-motion');
  const cards = [...document.querySelectorAll('.work-item')];
  const observers = [];
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const element = entry.target;
        observer.unobserve(element);
        element.classList.add('detail-in-view');
        if (element.matches('.work-item') && typeof element.animate === 'function') {
          const columns = getComputedStyle(element.parentElement).gridTemplateColumns.split(' ').length;
          const animation = element.animate([
            { opacity: 0, transform: 'translateY(24px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ], { duration: 850, delay: (cards.indexOf(element) % columns) * 65, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
          animations.add(animation);
          animation.finished.then(() => animations.delete(animation)).catch(() => {});
        }
      }
    }, { rootMargin: '0px 0px -28px 0px' });
    document.querySelectorAll('.section-title, .work-item').forEach(element => observer.observe(element));
    observers.push(observer);
  }

  const progress = document.createElement('div');
  progress.className = 'reading-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.append(progress);
  const sections = [...document.querySelectorAll('main > section[id]')];
  const links = [...document.querySelectorAll('.nav a[href^="#"]')];
  let frame = 0;
  function render() {
    frame = 0;
    const max = root.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0})`;
    let current = sections[0]?.id;
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= window.innerHeight * .4) current = section.id;
    }
    for (const link of links) {
      const active = link.hash === `#${current}`;
      link.classList.toggle('is-current', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(render); }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  render();
  cleanup = () => {
    root.classList.remove('refined-motion');
    observers.forEach(observer => observer.disconnect());
    animations.forEach(animation => animation.cancel());
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
    cancelAnimationFrame(frame);
    progress.remove();
    links.forEach(link => { link.classList.remove('is-current'); link.removeAttribute('aria-current'); });
    document.querySelectorAll('.detail-in-view').forEach(element => element.classList.remove('detail-in-view'));
  };
}
configureMotion();
reduced.addEventListener('change', configureMotion);
