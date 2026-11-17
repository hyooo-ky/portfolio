import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export function mountWebScene(container, reducedMotion) {
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' }); }
  catch { return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(37, 1, .1, 40);
  camera.position.z = 8.3;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, .04);
  scene.environment = environment.texture;
  room.dispose(); pmrem.dispose();
  const webScene = new THREE.Group(); scene.add(webScene);
  const metal = new THREE.MeshStandardMaterial({ color: 0xbfc6ce, metalness: .95, roughness: .22, transparent: true });
  const porcelain = new THREE.MeshStandardMaterial({ color: 0xf0f1f2, metalness: .28, roughness: .3, transparent: true });
  const blue = new THREE.MeshBasicMaterial({ color: 0x343bff, transparent: true, toneMapped: false });
  const pale = new THREE.MeshStandardMaterial({ color: 0xd2d7df, metalness: .5, roughness: .36, transparent: true });
  const nodesMaterial = new THREE.MeshStandardMaterial({ color: 0x8d97a6, metalness: .9, roughness: .25, transparent: true });
  const layers = [];
  function rounded(width, height, radius) {
    const x=-width/2, y=-height/2, s=new THREE.Shape();
    s.moveTo(x+radius,y);s.lineTo(x+width-radius,y);s.quadraticCurveTo(x+width,y,x+width,y+radius);
    s.lineTo(x+width,y+height-radius);s.quadraticCurveTo(x+width,y+height,x+width-radius,y+height);
    s.lineTo(x+radius,y+height);s.quadraticCurveTo(x,y+height,x,y+height-radius);
    s.lineTo(x,y+radius);s.quadraticCurveTo(x,y,x+radius,y);return s;
  }
  function panel(w,h,x,y,z,mat,depth=.055) {
    const geometry=new THREE.ExtrudeGeometry(rounded(w,h,w>4?.24:Math.min(.08,h/4)),{depth,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.018,bevelThickness:.018,curveSegments:8});
    const mesh=new THREE.Mesh(geometry,mat.clone());mesh.position.set(x,y,z);webScene.add(mesh);layers.push({mesh,w,h,x,y,z});return mesh;
  }
  panel(4.4,3.25,0,0,0,metal,.14);
  panel(4.12,2.95,0,-.02,.16,porcelain,.035);
  panel(3.86,1.06,0,.32,.23,blue,.035);
  panel(1.85,.78,-1.005,-.82,.23,pale,.04);
  panel(1.85,.78,1.005,-.82,.23,pale,.04);
  panel(.43,.075,-1.68,1.22,.24,blue,.025);
  for(let i=0;i<3;i++)panel(.23,.025,1.05+i*.34,1.22,.24,metal,.02);
  // Geometric image placeholders: a small blue accent and silver diagonal surfaces.
  const stripe=panel(1.55,.18,.82,.34,.285,porcelain,.01);stripe.rotation.z=.6;
  for(const x of [-1.005,1.005]) {
    panel(1.52,.024,x,-1.31,.24,metal,.01);
    panel(.8,.024,x-.36,-1.43,.24,pale,.01);
  }
  const dots=[];
  for(let i=0;i<3;i++) {
    const dot=new THREE.Mesh(new THREE.SphereGeometry(.035,12,8),metal);dot.position.set(-1.86+i*.13,1.45,.23);webScene.add(dot);dots.push(dot);
  }
  const grid=new THREE.Group();webScene.add(grid);
  const gridMaterial=new THREE.LineBasicMaterial({color:0x616a78,transparent:true,opacity:.65});
  const segments=[];
  for(let i=0;i<=6;i++){const x=-2.2+i*4.4/6;segments.push(x,-1.625,.01,x,1.625,.01);}
  for(let i=0;i<=4;i++){const y=-1.625+i*3.25/4;segments.push(-2.2,y,.01,2.2,y,.01);}
  const gridGeometry=new THREE.BufferGeometry();gridGeometry.setAttribute('position',new THREE.Float32BufferAttribute(segments,3));
  grid.add(new THREE.LineSegments(gridGeometry,gridMaterial));
  for(let i=0;i<=6;i++)for(let j=0;j<=4;j++){
    const node=new THREE.Mesh(new THREE.SphereGeometry(.035,10,6),nodesMaterial);node.position.set(-2.2+i*4.4/6,-1.625+j*3.25/4,.02);grid.add(node);
  }
  const wireMaterial=new THREE.LineBasicMaterial({color:0x666e7c,transparent:true});
  const wire=new THREE.Group();webScene.add(wire);
  for(const {mesh,z} of layers.slice(0,5)){
    const edge=new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry,25),wireMaterial);edge.position.copy(mesh.position);wire.add(edge);
  }
  // The same UI panels reflow from desktop columns into a mobile stack.
  const mobileLayout = [
    [2.15,4.1,0,0],[1.98,3.9,0,0],[1.72,.88,0,.70],
    [1.72,.70,0,-.26],[1.72,.70,0,-1.18],[.30,.06,-.68,1.45],
    [.12,.025,.43,1.45],[.12,.025,.59,1.45],[.12,.025,.75,1.45],
    [.65,.12,.36,.70],[1.5,.024,0,-.70],[.8,.024,-.34,-.84],
    [1.5,.024,0,-1.62],[.8,.024,-.34,-1.77],
  ];
  const phoneInk = new THREE.MeshBasicMaterial({color:0x25272b,transparent:true,opacity:0});
  const phoneDetail = new THREE.Group(); webScene.add(phoneDetail);
  for (const [w,h,y,z] of [[.48,.09,1.76,.23],[.53,.025,-1.94,.23]]) {
    const geometry = new THREE.ExtrudeGeometry(rounded(w,h,h/2),{depth:.012,bevelEnabled:false,curveSegments:8});
    const mesh = new THREE.Mesh(geometry,phoneInk);mesh.position.set(0,y,z);phoneDetail.add(mesh);
  }
  renderer.domElement.setAttribute('aria-hidden','true');container.append(renderer.domElement);
  const hero=document.querySelector('#hero');
  let constructionEnd=hero.offsetHeight*.52;
  let raf=0,visible=true,last=performance.now(),start=last,progress=0,mobile=0,pointerX=0,pointerY=0;
  const ease=(a,b,p)=>THREE.MathUtils.smoothstep(p,a,b);
  function draw(time){
    raf=0;const delta=Math.min(.1,(time-last)/1000);last=time;
    const staticMode=reducedMotion.matches;
    const target=staticMode?1:Math.min(1,Math.max(0,scrollY/Math.max(1,constructionEnd)));
    progress=staticMode?1:THREE.MathUtils.lerp(progress,target,1-Math.exp(-delta*8));
    const page = staticMode ? 0 : scrollY / Math.max(1,document.documentElement.scrollHeight-innerHeight);
    const mobileTarget = staticMode ? 0 : ease(.18,.42,page);
    mobile = staticMode ? 0 : THREE.MathUtils.lerp(mobile,mobileTarget,1-Math.exp(-delta*6));
    const t=staticMode?0:(time-start)/1000;
    const fill=ease(.26,.84,progress);
    gridMaterial.opacity=(1-ease(.18,.73,progress))*.65;
    nodesMaterial.opacity=1-ease(.25,.77,progress);
    grid.visible=progress<.8;
    wireMaterial.opacity=ease(.04,.3,progress)*(1-ease(.69,.98,progress))*.8;
    wire.visible=progress>.03&&progress<.99;
    for(const mat of [metal,porcelain,blue,pale]){mat.opacity=fill;mat.depthWrite=fill>.98;}
    layers.forEach(({mesh,w,h,x,y,z},index)=>{
      const [mw,mh,mx,my] = mobileLayout[index];
      mesh.visible=fill>.005;
      mesh.material.opacity=fill;
      mesh.material.depthWrite=fill>.98;
      mesh.scale.set(THREE.MathUtils.lerp(1,mw/w,mobile),THREE.MathUtils.lerp(1,mh/h,mobile),1);
      mesh.position.set(THREE.MathUtils.lerp(x,mx,mobile),THREE.MathUtils.lerp(y,my,mobile),z+(1-fill)*(.25+z*2));
    });
    dots.forEach(dot=>{dot.visible=fill>.005&&mobile<.95;dot.material.opacity=fill*(1-mobile);});
    phoneInk.opacity=fill*ease(.3,.85,mobile);
    phoneDetail.visible=mobile>.01;
    webScene.rotation.set(-1.02+ease(0,.9,progress)*.47+mobile*.28+(staticMode?0:pointerY*.08+Math.sin(page*Math.PI*2)*.10),-.22+(staticMode?0:pointerX*.14+Math.sin(page*Math.PI*2)*.32),-.13+progress*.08+Math.sin(page*Math.PI*2)*.06);
    webScene.position.y=staticMode?0:Math.sin(t*.55)*.025;
    renderer.render(scene,camera);container.classList.add('web-scene-ready','webgl-ready');
    if(visible&&!staticMode&&!document.hidden)raf=requestAnimationFrame(draw);
  }
  function requestDraw(){if(!raf)raf=requestAnimationFrame(draw);}
  const resizer=new ResizeObserver(()=>{constructionEnd=hero.offsetHeight*.52;const r=container.getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera.aspect=r.width/Math.max(1,r.height);camera.updateProjectionMatrix();requestDraw();});resizer.observe(container);
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)requestDraw();else{cancelAnimationFrame(raf);raf=0;}});observer.observe(container);
  hero.addEventListener('pointermove',e=>{if(reducedMotion.matches||e.pointerType!=='mouse')return;pointerX=e.clientX/innerWidth-.5;pointerY=e.clientY/innerHeight-.5;},{passive:true});
  reducedMotion.addEventListener('change',()=>{cancelAnimationFrame(raf);raf=0;requestDraw();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else requestDraw();});
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(raf);raf=0;container.classList.remove('web-scene-ready','webgl-ready');});
  renderer.domElement.addEventListener('webglcontextrestored',requestDraw);
  addEventListener('pagehide',()=>{cancelAnimationFrame(raf);raf=0;});addEventListener('pageshow',requestDraw);
}
