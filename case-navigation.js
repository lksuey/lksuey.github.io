/* Per-entry return context, independent of a case's internal history. */
(() => {
  const index = /\/(?:(?:index|en|pl)\.html)?$/.test(location.pathname);
  const key = 'portfolio-case-return-v2';
  const valid = state => state && Number.isFinite(state.y) && Date.now()-parseInt(state.id,36)<43200000 && new URL(state.url,location.href).origin===location.origin;
  const read = () => { try { const state=JSON.parse(sessionStorage.getItem(key));return valid(state)?state:null; } catch { return null; } };
  const write = value => { try { sessionStorage.setItem(key, JSON.stringify(value)); } catch {} };
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  let restoring = false, active = null, releaseFontAnchor = () => {};
  const query = new URL(location.href).searchParams.get('resume');
  const requested=read();
  const isReload=performance.getEntriesByType('navigation')[0]?.type==='reload';
  // Reload belongs to the current document position, not a past case trip.
  // Keep its history metadata available for a later genuine back navigation.
  const candidate = index&&!isReload ? (query && requested?.id===query ? requested : history.state?.portfolioReturn) : null;
  const initial=valid(candidate)&&requested?.id===candidate.id&&requested.returnInput ? {...candidate,input:requested.returnInput} : candidate;
  window.portfolioReturnVisit=index&&!!valid(initial);
  if (!index && requested?.case===location.pathname && !requested.consumed && !history.state?.portfolioCaseReturn) {
    history.replaceState({...history.state,portfolioCaseReturn:requested},'',location.href);
    write({...requested,consumed:true});
  }
  if (valid(initial)) { document.documentElement.classList.add('portfolio-restoring'); setTimeout(() => document.documentElement.classList.remove('portfolio-restoring'), 2000); }
  if (index) history.scrollRestoration = valid(initial)?'manual':'auto';
  const snapshot = (link,input) => {
    const card = link?.closest('.project-card') || [...document.querySelectorAll('.project-card')].find(c=>[...c.querySelectorAll('a')].some(a=>a.href===active?.anchor));
    return { id: Date.now().toString(36), url: location.href, x: scrollX, y: scrollY, width: innerWidth, height: innerHeight,
      entryKey:window.navigation?.currentEntry?.key,
      input:input||active?.input||'pointer',
      case: link ? new URL(link.href).pathname : active?.case, anchor: card?.querySelector('a.text-link')?.href || active?.anchor,
      offset: card ? card.getBoundingClientRect().top : active?.offset,
      controls: [...document.querySelectorAll('[data-project-filter], #projetos select, #projetos input')].map(el => ({id:el.id,value:el.value,checked:el.checked})) };
  };
  const remember = (link,input) => { if(link)history.scrollRestoration='manual';active = snapshot(link,input); write(active); history.replaceState({...history.state,portfolioReturn:active}, '', location.href); return active; };
  const destination = href => {
    if (reduced() || !document.body.animate) { location.assign(href); return; }
    document.body.animate([{opacity:1},{opacity:.35}], {duration:120,easing:'ease-out',fill:'forwards'}).finished.catch(()=>{}).then(()=>location.assign(href));
  };
  let returnFallback;
  const returnToEntry = (state,href) => {
    // Resolve the actual entry key, not "back one": case anchors may add history.
    const entry=window.navigation?.entries().find(e=>e.key===state.entryKey);
    const current=window.navigation?.currentEntry;
    if(entry&&current&&entry.index<current.index){
      returnFallback=setTimeout(()=>location.assign(href),600);
      history.go(entry.index-current.index);
    }else location.assign(href);
  };
  document.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link || link.hasAttribute('download') || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === '_blank') return;
    const url = new URL(link.href);
    if (url.origin !== location.origin) return;
    if (index && link.closest('.project-card') && /\.html$/.test(url.pathname)) { remember(link,event.detail===0?'keyboard':'pointer'); event.preventDefault(); destination(link.href); }
    else if (!index && /\/(?:index|en|pl)\.html$/.test(url.pathname)) {
      const state = history.state?.portfolioCaseReturn || read(); event.preventDefault();
      if (valid(state) && state.case === location.pathname) { write({...state,returnInput:event.detail===0?'keyboard':'pointer'}); const back = new URL(state.url); back.searchParams.set('resume',state.id); returnToEntry(state,back.href); }
      else destination(link.href);
    }
  });
  async function restore(state) {
    if (!valid(state) || restoring) return;
    const intent=read();if(intent?.id===state.id&&intent.returnInput)state={...state,input:intent.returnInput};
    restoring = true; active = state; document.body.getAnimations?.().forEach(a=>a.cancel());
    window.portfolioReturnVisit=true;document.documentElement.classList.add('portfolio-returning');
    document.documentElement.classList.add('portfolio-restoring');
    try {
    // Font substitution can make Chromium adjust scroll even when the saved
    // card's document position has not moved. Exclude this return from native
    // anchoring until fonts settle; never counter-scroll after user input.
    releaseFontAnchor();
    const root=document.documentElement, previousAnchor=root.style.overflowAnchor, previousAnchorPriority=root.style.getPropertyPriority('overflow-anchor');
    root.style.overflowAnchor='none';
    let released=false, anchorTimer;
    const scrollKeys=new Set(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','PageUp','PageDown','Home','End',' ']);
    const onIntent=event=>{if(event.type!=='keydown'||scrollKeys.has(event.key))release();};
    const release=()=>{
      if(released)return;released=true;clearTimeout(anchorTimer);
      if(previousAnchor)root.style.setProperty('overflow-anchor',previousAnchor,previousAnchorPriority);else root.style.removeProperty('overflow-anchor');
      for(const type of ['wheel','touchmove','pointerdown','keydown'])removeEventListener(type,onIntent,true);
    };
    releaseFontAnchor=release;
    for(const type of ['wheel','touchmove','pointerdown','keydown'])addEventListener(type,onIntent,{capture:true,passive:true});
    anchorTimer=setTimeout(release,8000);
    Promise.resolve(document.fonts?.ready).then(()=>requestAnimationFrame(()=>requestAnimationFrame(release)),release);
    state.controls?.forEach(c => { const el=document.getElementById(c.id); if(el){el.value=c.value;el.checked=c.checked;el.dispatchEvent(new Event('change',{bubbles:true}));} });
    // Reserved image dimensions keep lazy media from delaying the return.
    // Retained documents already have final font and image geometry; fresh
    // documents wait for fonts, never for offscreen image decoding.
    // A back_forward navigation can reconstruct the document rather than use
    // BFCache. Its fonts must settle before the first restored composition.
    if(!document.documentElement.dataset.returnRestored)
      await Promise.race([document.fonts?.ready,new Promise(r=>setTimeout(r,1200))]);
    const target = () => {
      if (state.width === innerWidth) return state.y;
      const card = [...document.querySelectorAll('.project-card')].find(c=>[...c.querySelectorAll('a')].some(a=>a.href===state.anchor));
      return card ? scrollY+card.getBoundingClientRect().top-(state.offset||0) : state.y;
    };
    const previous=document.documentElement.style.scrollBehavior; document.documentElement.style.scrollBehavior='auto';
    scrollTo(state.x,target()); await new Promise(requestAnimationFrame); scrollTo(state.x,target());
    history.replaceState({...history.state,portfolioReturn:state},'',state.url);
    document.documentElement.style.scrollBehavior=previous; document.documentElement.classList.remove('portfolio-restoring'); restoring=false;
    const returnLink=[...document.querySelectorAll('.project-card a')].find(a=>new URL(a.href).pathname===state.case);
    if(state.input==='keyboard')returnLink?.focus({preventScroll:true});
    else if(document.activeElement?.closest('.project-card'))document.activeElement.blur();
    if(!reduced()) returnLink?.closest('.project-card')?.animate([{opacity:.86},{opacity:1}],{duration:160,easing:'cubic-bezier(.16,1,.3,1)'});
    document.documentElement.dataset.returnRestored=state.id;
    dispatchEvent(new Event('portfolio:return-ready'));
    } finally { document.documentElement.classList.remove('portfolio-restoring'); restoring=false; }
  }
  const clearReloadFocus=()=>{
    const focused=document.activeElement,state=history.state?.portfolioReturn;
    if(index&&isReload&&focused?.closest('.project-card')&&new URL(focused.href).pathname===state?.case)focused.blur();
  };
  addEventListener('DOMContentLoaded',()=>{if(index&&valid(initial))restore(initial);else clearReloadFocus();});
  addEventListener('pageshow', event => { const state=history.state?.portfolioReturn||initial;if(index&&isReload&&!event.persisted)clearReloadFocus();else if(index&&!restoring&&(event.persisted||window.portfolioReturnVisit)&&document.documentElement.dataset.returnRestored!==state?.id)restore(state);else if(!index)document.body.getAnimations?.().forEach(a=>a.cancel()); });
  addEventListener('pagehide', () => { clearTimeout(returnFallback);releaseFontAnchor();if(index && !restoring && active) remember(); });
})();
