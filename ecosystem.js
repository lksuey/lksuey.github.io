const pipelineLocale = document.documentElement.lang.toLowerCase().startsWith('pl') ? 'pl' : document.documentElement.lang.toLowerCase().startsWith('en') ? 'en' : 'pt';
const pipelineCopies = {pt:[
 ['Encontrar onde existe uma oportunidade.','O scanner usa Playwright para pesquisar negócios no Google Maps por segmento e região. A coleta em lotes mantém um cursor de progresso para retomar o trabalho.','Google Maps → Playwright → registros da coleta'],
 ['Transformar registros em prospects com contexto.','O pipeline normaliza contatos, classifica links e aplica critérios de avaliações, presença de site e exclusões. Identificadores do Maps evitam duplicidade no índice local.','Dados brutos → classificação → qualificação → índice JSON'],
 ['Dar a cada prospect um lugar e um estado.','O Trello organiza o trabalho humano e o índice local mantém os vínculos técnicos. A admissão em lotes limita a entrada de novos cards e o watcher acompanha listas e checklists.','Prospect qualificado → índice CID → card Trello'],
 ['Dar à IA uma direção concreta.','O operador preenche briefing, cores e o ZIP de assets no card. Dois checklists humanos precisam estar concluídos antes de o watcher iniciar a produção.','Card Trello → briefing + cores + assets → validação'],
 ['Orquestrar a construção de uma página individual.','O executor prepara um diretório por prospect e aciona Claude Code com contexto e ferramentas delimitadas. A impressão digital dos insumos evita repetir uma produção já concluída.','Contexto validado → Claude Code → copy + HTML + CSS + JS'],
 ['Verificar antes de passar à próxima etapa.','O QA técnico abre a página em desktop e mobile, verifica arquivos e erros do navegador e prepara o ZIP. Falhas seguem para QA técnico; a revisão visual, o deploy e o contato comercial ficam com o operador.','Site local → QA desktop/mobile → ZIP → revisão humana']
],en:[
 ['Find where an opportunity exists.','The scanner uses Playwright to research businesses on Google Maps by segment and region. Batch collection keeps a progress cursor so work can resume.','Google Maps → Playwright → collection records'],
 ['Turn records into prospects with context.','The pipeline normalizes contacts, classifies links, and applies review, website-presence, and exclusion criteria. Maps identifiers prevent duplicates in the local index.','Raw data → classification → qualification → JSON index'],
 ['Give every prospect a place and a state.','Trello organizes human work while the local index preserves technical links. Batch admission limits new cards and the watcher follows lists and checklists.','Qualified prospect → CID index → Trello card'],
 ['Give AI concrete direction.','The operator adds a brief, colors, and an asset ZIP to the card. Two human checklists must be complete before production starts.','Trello card → brief + colors + assets → validation'],
 ['Orchestrate an individual page build.','The executor prepares one directory per prospect and starts Claude Code with bounded context and tools. Input fingerprints prevent duplicate builds.','Validated context → Claude Code → copy + HTML + CSS + JS'],
 ['Verify before moving forward.','Technical QA opens the page on desktop and mobile, checks files and browser errors, and prepares the ZIP. Visual review, deployment, and outreach remain human decisions.','Local site → desktop/mobile QA → ZIP → human review']
],pl:[
 ['Znajdź firmy, w których kryje się realny potencjał.','Skaner wykorzystuje Playwright do wyszukiwania firm w Google Maps według branży i regionu. Przetwarzanie partiami zapisuje postęp, dzięki czemu proces można bezpiecznie wznowić.','Google Maps → Playwright → rekordy wyszukiwania'],
 ['Zamień surowe rekordy w leady z kontekstem.','Pipeline porządkuje dane kontaktowe, klasyfikuje linki i stosuje kryteria dotyczące opinii, obecności strony internetowej oraz wykluczeń. Identyfikatory Google Maps zapobiegają duplikatom.','Surowe dane → klasyfikacja → kwalifikacja → indeks JSON'],
 ['Nadaj każdemu leadowi miejsce i status.','Trello porządkuje pracę człowieka, a lokalny indeks zachowuje powiązania techniczne. Obsługa partiami ogranicza liczbę nowych kart, a proces monitorujący śledzi listy i checklisty.','Zakwalifikowany lead → indeks CID → karta Trello'],
 ['Daj AI jasny kierunek.','Operator uzupełnia brief, paletę kolorów i archiwum ZIP z materiałami. Dwie checklisty wymagają zatwierdzenia przez człowieka, zanim rozpocznie się produkcja.','Karta Trello → brief + kolory + materiały → walidacja'],
 ['Orkiestruj budowę dedykowanej strony.','Moduł wykonawczy przygotowuje osobny katalog dla każdego leada i uruchamia Claude Code z precyzyjnie ograniczonym kontekstem oraz zestawem narzędzi. Cyfrowy odcisk danych wejściowych zapobiega powielaniu pracy.','Zweryfikowany kontekst → Claude Code → treść + HTML + CSS + JS'],
 ['Sprawdź rezultat przed przekazaniem dalej.','Kontrola techniczna otwiera stronę w widoku desktopowym i mobilnym, sprawdza pliki oraz błędy przeglądarki, a następnie przygotowuje archiwum ZIP. Ocena wizualna, publikacja i kontakt handlowy pozostają decyzjami człowieka.','Strona lokalna → QA desktop/mobile → ZIP → przegląd człowieka']
]};
const pipelineSteps = pipelineCopies[pipelineLocale];
const pipelineTabs = [...document.querySelectorAll('.pipeline-tabs button')];
const pipelinePanel = document.getElementById('pipeline-panel');
function selectPipelineStep(index, focus=false) {
 pipelineTabs.forEach((button,i)=> { button.setAttribute('aria-selected',String(i===index)); button.tabIndex=i===index?0:-1; });
 pipelinePanel.setAttribute('aria-labelledby',pipelineTabs[index].id);
 const [title,copy,code] = pipelineSteps[index];
 pipelinePanel.querySelector('h4').textContent=title;
 pipelinePanel.querySelector('p').textContent=copy;
 pipelinePanel.querySelector('code').textContent=code;
 if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches) pipelinePanel.animate([{opacity:.25,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}],{duration:300,easing:'ease-out'});
 if(focus) pipelineTabs[index].focus();
}
pipelineTabs.forEach((button,index)=> {
 button.addEventListener('click',()=>selectPipelineStep(index));
 button.addEventListener('keydown',event=> {
  let next=index;
  if(event.key==='ArrowRight') next=(index+1)%pipelineTabs.length;
  else if(event.key==='ArrowLeft') next=(index+pipelineTabs.length-1)%pipelineTabs.length;
  else if(event.key==='Home') next=0;
  else if(event.key==='End') next=pipelineTabs.length-1;
  else return;
  event.preventDefault(); selectPipelineStep(next,true);
 });
});
selectPipelineStep(0);

// Fast, viewport-triggered reveals inside the expandable skills case.
const skillsDisclosure = document.querySelector('.case-skills');
const skillsMotionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const skillsBlocks = [...skillsDisclosure.querySelectorAll('.skills-intro, .skill-table > div:not(.skill-table-head), .skills-note')];
const skillsRuns = new Map();
function finishSkillBlock(block) {
 const run = skillsRuns.get(block);
 if (!run) return;
 cancelAnimationFrame(run.frame);
 run.animation?.cancel();
 run.fields.forEach(({element,text}) => { element.textContent = text; element.classList.remove('skill-typing'); });
 skillsRuns.delete(block);
}
function animateSkillBlock(block, delay) {
 if (!skillsDisclosure.open || skillsMotionPreference.matches) return;
 finishSkillBlock(block);
 const elements = block.matches('p') ? [block] : [...block.querySelectorAll('strong,h4,p')];
 const fields = elements.map(element => {
  const text = element.textContent;
  const reserve = document.createElement('span');
  reserve.className = 'skill-text-reserve'; reserve.textContent = text;
  const ink = document.createElement('span');
  ink.className = 'skill-text-ink'; ink.setAttribute('aria-hidden','true');
  element.classList.add('skill-typing'); element.replaceChildren(reserve,ink);
  return {element,text,ink};
 });
 const run = {fields, frame:0, animation:block.animate(
  [{opacity:.25,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],
  {duration:320,delay,fill:'backwards',easing:'cubic-bezier(.2,.8,.2,1)'}
 )};
 skillsRuns.set(block,run);
 const start = performance.now()+delay;
 const tick = now => {
  const progress = Math.max(0,Math.min((now-start)/580,1));
  fields.forEach(({text,ink})=> { ink.textContent=text.slice(0,Math.ceil(text.length*progress)); });
  if(progress < 1) run.frame=requestAnimationFrame(tick); else finishSkillBlock(block);
 };
 run.frame=requestAnimationFrame(tick);
}
const skillsVisibility = new IntersectionObserver(entries => {
 let order=0;
 entries.forEach(entry=> {
  if(entry.isIntersecting && skillsDisclosure.open) {
   skillsVisibility.unobserve(entry.target);
   animateSkillBlock(entry.target,Math.min(order++*35,140));
  }
 });
}, {threshold:.08});
function syncSkillsMotion() {
 skillsVisibility.disconnect();
 [...skillsRuns.keys()].forEach(finishSkillBlock);
 if(skillsDisclosure.open && !skillsMotionPreference.matches) skillsBlocks.forEach(block=>skillsVisibility.observe(block));
}
skillsDisclosure.addEventListener('toggle',syncSkillsMotion);
skillsMotionPreference.addEventListener('change',syncSkillsMotion);
syncSkillsMotion();
