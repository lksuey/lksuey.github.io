// These accents run once per tab session, never in a continuous loop.
function sessionAccent(element, key) {
 if(!element) return;
 let seen=false;
 try { seen=sessionStorage.getItem(key)==='done'; } catch {}
 if(seen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 const watcher=new IntersectionObserver(entries=>{
  if(!entries.some(entry=>entry.isIntersecting))return;
  watcher.disconnect();
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  try {sessionStorage.setItem(key,'done');} catch {}
  element.classList.add('play-once');
 },{threshold:.5});
 watcher.observe(element);
}
sessionAccent(document.querySelector('.rotating-plus'),'portfolio-plus-pastel-v1');
sessionAccent(document.querySelector('.liquid-text'),'portfolio-fill-pastel-v1');
