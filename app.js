const menu = document.querySelector('.menu-toggle');
const header = document.querySelector('.header');
const pageLocale = document.documentElement.lang.toLowerCase().startsWith('pl') ? 'pl' : document.documentElement.lang.toLowerCase().startsWith('en') ? 'en' : 'pt';
const menuCopy = {pt:{open:'Abrir menu',close:'Fechar menu',project:'Conhecer o projeto ↗',explore:'Explorar projeto ↗'},en:{open:'Open menu',close:'Close menu',project:'View case study ↗',explore:'Explore project ↗'},pl:{open:'Otwórz menu',close:'Zamknij menu',project:'Pełne studium przypadku (po angielsku) ↗',explore:'Poznaj projekt ↗'}}[pageLocale];
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? menuCopy.close : menuCopy.open); header.classList.toggle('menu-open', open); });
document.querySelectorAll('.header nav a').forEach(a => a.addEventListener('click', () => { menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', menuCopy.open); header.classList.remove('menu-open'); }));
document.addEventListener('keydown', e => { if(e.key === 'Escape') { header.classList.remove('menu-open'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', menuCopy.open); } });
const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), {threshold: .08});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
document.getElementById('year').textContent = new Date().getFullYear();
const projects = window.portfolioProjects || [];
const grid = document.getElementById('project-grid');
const safeURL = value => { try { const url = new URL(value, location.href); return ['http:', 'https:'].includes(url.protocol) ? url.href : null; } catch { return null; } };
projects.forEach(project => { const card = document.createElement('article'); card.className = 'project-card'; if (project.image && safeURL(project.image)) { const img = document.createElement('img'); img.src = project.image; img.alt = project.imageAlt || project.title; img.loading = 'lazy'; img.width = 1600; img.height = project.caseUrl === 'assina-ai.html' ? 1000 : 900; card.append(img); } const body = document.createElement('div'); const category = document.createElement('span'); category.className = 'eyebrow'; category.textContent = project.category; const title = document.createElement('h3'); title.textContent = project.title; const description = document.createElement('p'); description.textContent = project.description; body.append(category,title,description); if(project.result) { const result=document.createElement('p'); result.className='project-result'; result.textContent=project.result; body.append(result); } const tags=document.createElement('div'); tags.className='tags'; (project.stack || []).forEach(tag => { const span=document.createElement('span'); span.textContent=tag; tags.append(span); }); body.append(tags); if(project.url && safeURL(project.url)) { const link=document.createElement('a'); link.className='text-link'; link.href=safeURL(project.url); link.target='_blank'; link.rel='noopener noreferrer'; link.textContent=menuCopy.explore; body.append(link); } card.append(body); grid.append(card); });
// English and Polish portfolio entries lead to the English technical case studies.
projects.forEach((project, index) => {
  if (!project.caseUrl) return;
  const url = safeURL(project.caseUrl);
  if (!url || new URL(url).origin !== location.origin) return;
  const body = grid.children[index].lastElementChild;
  const link = document.createElement('a');
  link.className = 'text-link';
  link.href = url;
  link.textContent = menuCopy.project;
  body.append(link);
});
document.getElementById('project-empty').hidden = projects.length > 0;
