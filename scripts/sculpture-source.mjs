import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export function mountSculpture(container, reducedMotion) {
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' }); }
  catch { return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.4;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(37, 1, .1, 40);
  camera.position.z = 9;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, .04);
  scene.environment = environment.texture;
  const geometry = new THREE.TorusKnotGeometry(1.5, .43, 192, 32, 2, 3);
  const material = new THREE.MeshStandardMaterial({ color: 0xcdd2d7, metalness: 1, roughness: .12, envMapIntensity: 1.3 });
  const sculpture = new THREE.Mesh(geometry, material);
  scene.add(sculpture);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  container.append(renderer.domElement);
  let raf = 0, visible = true, start = performance.now(), disposed = false;
  let pointerX = 0, pointerY = 0;
  const hero = document.querySelector('#hero');
  function draw(time) {
    raf = 0;
    if (disposed) return;
    const staticMode = reducedMotion.matches;
    const t = staticMode ? 0 : (time - start) / 1000;
    const progress = staticMode ? 0 : Math.min(1, Math.max(0, scrollY / Math.max(1, hero.offsetHeight)));
    sculpture.rotation.set(.35 + progress * .9 + pointerY * .15, .5 + t * .12 + progress * 2.2 + pointerX * .25, -.15 - progress * .85);
    const morph = Math.sin(progress * Math.PI);
    sculpture.scale.set(1 + morph * .16, 1 - morph * .12, 1 + morph * .08);
    sculpture.position.y = staticMode ? 0 : Math.sin(t * .65) * .09;
    renderer.render(scene, camera);
    container.classList.add("webgl-ready");
    container.classList.add('sculpture-ready');
    if (visible && !staticMode && !document.hidden) raf = requestAnimationFrame(draw);
  }
  function requestDraw() { if (!raf && !disposed) raf = requestAnimationFrame(draw); }
  function resize() {
    const { width, height } = container.getBoundingClientRect();
    renderer.setSize(width, height, false);
    camera.aspect = width / Math.max(1, height); camera.updateProjectionMatrix(); requestDraw();
  }
  const resizer = new ResizeObserver(resize); resizer.observe(container);
  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible) requestDraw(); else { cancelAnimationFrame(raf); raf = 0; }
  }); observer.observe(hero);
  hero.addEventListener('pointermove', e => {
    if (reducedMotion.matches || e.pointerType !== 'mouse') return;
    pointerX = e.clientX / innerWidth - .5; pointerY = e.clientY / innerHeight - .5;
  }, { passive: true });
  reducedMotion.addEventListener('change', () => { cancelAnimationFrame(raf); raf = 0; requestDraw(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) {cancelAnimationFrame(raf);raf=0;} else requestDraw(); });
  renderer.domElement.addEventListener('webglcontextlost', event => {
    event.preventDefault();cancelAnimationFrame(raf);raf=0;container.classList.remove('sculpture-ready');
  });
  renderer.domElement.addEventListener('webglcontextrestored', requestDraw);
  addEventListener('pagehide', () => { cancelAnimationFrame(raf); raf = 0; });
  addEventListener('pageshow', requestDraw);
  resize();
}
