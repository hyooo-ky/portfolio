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
function syncButton(){
  if(!button)return;
  button.hidden=false;
  button.setAttribute('aria-pressed',String(!motion.matches));
  button.textContent=motion.matches?'動き OFF':'動き ON';
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
