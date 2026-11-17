// The visitor's choice controls all animation; OS preferences are not used.
const root=document.documentElement;
if(!root.dataset.motion)root.dataset.motion='on';
class MotionPreference extends EventTarget {
  get matches(){return root.dataset.motion==='off';}
  setEnabled(enabled){
    root.dataset.motion=enabled?'on':'off';
    try{localStorage.setItem('portfolio-motion',root.dataset.motion);}catch{}
    this.dispatchEvent(new Event('change'));
  }
}
export const motion=new MotionPreference();
const button=document.querySelector('.motion-toggle');
const star=button?.querySelector('.motion-toggle-star');
let angle=0,speed=motion.matches?0:36,frame=0,last=0;
function tick(time){
  frame=0;
  const dt=last?Math.min((time-last)/1000,.05):0;last=time;
  const enabled=!motion.matches,target=enabled?36:0;
  speed+=(target-speed)*(1-Math.exp(-dt/(enabled ? .3 : .55)));
  if(!enabled&&speed<.025)speed=0;
  angle=(angle+speed*dt)%360;
  star?.style.setProperty('--star-angle',angle+'deg');
  if((enabled||speed>0)&&!document.hidden)frame=requestAnimationFrame(tick);
}
function startRotation(){if(star&&!frame&&!document.hidden){last=0;frame=requestAnimationFrame(tick);}}
document.addEventListener('visibilitychange',()=>{
  if(document.hidden){cancelAnimationFrame(frame);frame=0;}else startRotation();
});
function syncButton(){
  if(!button)return;
  button.hidden=false;
  button.setAttribute('aria-pressed',String(!motion.matches));
  button.title=motion.matches?'アニメーションをONにする':'アニメーションをOFFにする';
  startRotation();
}
button?.addEventListener('click',()=>motion.setEnabled(motion.matches));
motion.addEventListener('change',syncButton);
addEventListener('storage',event=>{
  if(event.key==='portfolio-motion'){
    root.dataset.motion=event.newValue==='off'?'off':'on';
    motion.dispatchEvent(new Event('change'));
  }
});
syncButton();
