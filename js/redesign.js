
const media = matchMedia('(prefers-reduced-motion: reduce)');
const header = document.querySelector('.header');
const art = document.querySelector('.hero-art');
const progress = document.createElement('div');
progress.className = 'reading-progress';
progress.setAttribute('aria-hidden','true');
document.body.append(progress);
const nav = [...document.querySelectorAll('.nav a')];
const sections = [...document.querySelectorAll('main > section')];
let frame = 0;
function render() {
  frame = 0;
  header.classList.toggle('is-scrolled', scrollY > 30);
  progress.style.transform = 'scaleX(' + (scrollY / Math.max(1,document.documentElement.scrollHeight-innerHeight)) + ')';
  let current = sections[0]?.id;
  for (const s of sections) if (s.getBoundingClientRect().top < innerHeight * .4) current = s.id;
  nav.forEach(a => { if(a.hash === '#' + current) a.setAttribute('aria-current','location'); else a.removeAttribute('aria-current'); });
  if(art && !media.matches) {
    art.style.setProperty('--art-y',Math.min(scrollY*.26,180)+'px');
    art.style.setProperty('--art-scale',String(1-Math.min(scrollY/innerHeight,1)*.14));
  }
}
function schedule(){ if(!frame) frame=requestAnimationFrame(render); }
addEventListener('scroll',schedule,{passive:true});
addEventListener('resize',schedule,{passive:true});
render();
let observer;
function reveal(){
  observer?.disconnect();
  document.querySelectorAll('.motion-pending').forEach(e=>{e.classList.remove('motion-pending','is-visible');e.style.removeProperty('--reveal-delay');});
  if(media.matches || !('IntersectionObserver' in window))return;
  observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}
  }),{rootMargin:'0px 0px -30px 0px'});
  document.querySelectorAll('.work-item,.about-photo,.about-text,.section-title').forEach((e,i)=>{
    if(e.getBoundingClientRect().top<innerHeight)return;
    e.classList.add('motion-pending');
    e.style.setProperty('--reveal-delay',e.matches('.work-item') ? ((i%2)*90+100)+'ms':'0ms');
    observer.observe(e);
  });
}
reveal();media.addEventListener('change',()=>{reveal();if(media.matches&&art){art.style.setProperty('--art-y','0px');art.style.setProperty('--art-x','0px');art.style.setProperty('--art-scale','1');}});
document.addEventListener('focusin',e=>e.target.closest('.motion-pending')?.classList.add('is-visible'));
document.addEventListener('click',e=>{
  const a=e.target.closest('a[href^="#"]');if(!a)return;
  const id=a.getAttribute('href').slice(1);if(!id)return;
  let t;try{t=document.getElementById(decodeURIComponent(id));}catch{return;}
  t?.classList.add('is-visible');
  t?.querySelectorAll('.motion-pending').forEach(el=>el.classList.add('is-visible'));
},{capture:true});
const dialog=document.querySelector('#workPreview');
let opener;
if(dialog && typeof dialog.showModal==='function'){
  const image=dialog.querySelector('img');
  document.addEventListener('click',e=>{
    const a=e.target.closest('a[data-preview-image]');
    if(!a||e.button!==0||e.metaKey||e.ctrlKey||e.altKey||e.shiftKey)return;
    image.src=a.dataset.previewImage;image.alt=a.dataset.previewTitle+' 旧サイトの全体画像';
    dialog.setAttribute('aria-label',a.dataset.previewTitle+'の画像プレビュー');
    opener=a;dialog.showModal();e.preventDefault();
    dialog.querySelector('.work-preview-scroll').scrollTop=0;
    document.documentElement.classList.add('preview-open');
  });
  dialog.querySelector('button').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))dialog.close();});
  dialog.addEventListener('close',()=>{document.documentElement.classList.remove('preview-open');image.removeAttribute('src');opener?.focus({preventScroll:true});});
}

if(art){
  const image=art.querySelector('img');
  if('IntersectionObserver' in window){
    const visibility=new IntersectionObserver(entries=>{image.style.animationPlayState=entries[0].isIntersecting?'running':'paused';});
    visibility.observe(document.querySelector('#hero'));
  }
  document.querySelector('#hero').addEventListener('pointermove',event=>{
    if(media.matches || event.pointerType!=='mouse')return;
    art.style.setProperty('--art-x',((event.clientX/innerWidth-.5)*18)+'px');
  },{passive:true});
  document.querySelector('#hero').addEventListener('pointerleave',()=>art.style.setProperty('--art-x','0px'));
}

if(art) import('./sculpture.js').then(module=>module.mountSculpture(art,media)).catch(()=>{});

if(art) import('./sculpture.js').then(module=>module.mountSculpture(art,media)).catch(()=>{});
