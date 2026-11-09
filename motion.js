const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finishers = new Set();
const onceVisible = (element, callback, threshold = .35) => {
  if (!element) return;
  const watcher = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) { watcher.disconnect(); callback(); }
  }, { threshold });
  watcher.observe(element);
};
onceVisible(document.querySelector('.proof-grid'), () => {
  if (reducedMotion.matches) return;
  document.querySelectorAll('.counter').forEach(counter => {
    const target = Number(counter.dataset.count);
    const duration = target === 6 ? 1800 : 2300;
    const plus = counter.parentElement.querySelector('.count-plus');
    let frame;
    const finish = () => { cancelAnimationFrame(frame); counter.textContent = target; plus?.classList.add('arrived'); finishers.delete(finish); };
    finishers.add(finish);
    plus?.classList.add('waiting');
    const start = performance.now();
    const tick = now => {
      const progress = Math.min((now - start) / duration, 1);
      counter.textContent = Math.floor(target * progress);
      if (progress < 1) frame = requestAnimationFrame(tick); else finish();
    };
    tick(start);
  });
  const language = document.querySelector('.language-count');
  let timer;
  let stage = 0;
  const finish = () => { clearTimeout(timer); language.textContent = 'C1'; finishers.delete(finish); };
  finishers.add(finish);
  const advance = () => {
    language.textContent = ['A1', 'B1', 'C1'][stage++];
    language.animate([{opacity:.2,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:350});
    if (stage < 3) timer = setTimeout(advance, 800); else finish();
  };
  advance();
});

// Reserve the full text's layout; only the visible overlay is typed.
// Assistive technology always receives the complete sentence, once.
const typingLines = [...document.querySelectorAll('.type-line')].map(element => {
  const text = element.textContent;
  const reserve = document.createElement('span');
  reserve.className = 'type-reserve'; reserve.textContent = text;
  const ink = document.createElement('span');
  ink.className = 'type-ink'; ink.textContent = text; ink.setAttribute('aria-hidden','true');
  element.replaceChildren(reserve, ink);
  return {element, ink, text};
});
onceVisible(document.querySelector('#contato'), async () => {
  if (reducedMotion.matches) return;
  typingLines.forEach(line => { line.ink.textContent=''; });
  for (const line of typingLines) {
    if (reducedMotion.matches) { line.ink.textContent=line.text; continue; }
    await new Promise(resolve => {
      let timer, index = 0;
      line.element.classList.add('typing');
      const finish = () => { clearTimeout(timer); line.ink.textContent=line.text; line.element.classList.remove('typing'); finishers.delete(finish); resolve(); };
      finishers.add(finish);
      const type = () => {
        if (index >= line.text.length) return finish();
        line.ink.textContent=line.text.slice(0,++index);
        timer=setTimeout(type,line.element.classList.contains('contact-copy') ? 19 : 38);
      };
      type();
    });
  }
}, .3);
reducedMotion.addEventListener('change', () => { if(reducedMotion.matches) [...finishers].forEach(finish=>finish()); });

const sections = [...document.querySelectorAll('main>section[id]')];
const navigation = [...document.querySelectorAll('.header nav a')];
const activeSection = new IntersectionObserver(entries => {
  entries.forEach(entry => { if(entry.isIntersecting) navigation.forEach(link => {
    const active = link.hash === '#' + entry.target.id;
    link.classList.toggle('active', active);
    if(active) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current');
  }); });
}, {rootMargin:'-15% 0px -55% 0px'});
sections.forEach(section=>activeSection.observe(section));

document.querySelectorAll('.expertise-grid article,.project-card,.finance-strip').forEach((card,index) => {
  card.classList.add('motion-card');
  card.style.setProperty('--delay', `${(index%4)*90}ms`);
  onceVisible(card,()=>card.classList.add('entered'),.12);
});

const careerTimeline = document.querySelector('.timeline');
onceVisible(careerTimeline, () => careerTimeline.classList.add('line-drawn'), .15);
careerTimeline.querySelectorAll('article').forEach(article => {
 onceVisible(article, () => {
  article.classList.add('career-entered');
  if(reducedMotion.matches) return;
  const fields=[...article.querySelectorAll('.time,h3,p')].map(element=> {
   const text=element.textContent;
   const reserve=document.createElement('span'); reserve.className='career-text-reserve';reserve.textContent=text;
   const ink=document.createElement('span');ink.className='career-text-ink';ink.setAttribute('aria-hidden','true');
   element.classList.add('career-typing');element.replaceChildren(reserve,ink);
   return {element,text,ink};
  });
  const animation=article.animate([{opacity:.4},{opacity:1}],{duration:450,easing:'ease-out'});
  let frame;
  const finish=()=>{cancelAnimationFrame(frame);animation.cancel();fields.forEach(({element,text})=>{element.textContent=text;element.classList.remove('career-typing');});finishers.delete(finish);};
  finishers.add(finish);
  const start=performance.now();
  const tick=now=>{
   const progress=Math.min((now-start)/750,1);
   fields.forEach(({text,ink})=>{ink.textContent=text.slice(0,Math.ceil(text.length*progress));});
   if(progress<1) frame=requestAnimationFrame(tick);else finish();
  };
  frame=requestAnimationFrame(tick);
 }, .18);
});
