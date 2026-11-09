// Adicione apenas projetos reais. Consulte README.md para o formato de cada case.
window.portfolioProjects = [
  {
    title: 'Assina AI',
    category: 'DADOS / AUTOMAÇÃO / PRODUTO WEB',
    description: 'Da coleta de propostas à leitura da operação: um sistema com esteira de conversão, visão gerencial, exportações e diagnóstico de eficiência. Python conecta as bases; Google Apps Script entrega a experiência web.',
    stack: ['Python', 'Google Apps Script', 'Google Sheets', 'JavaScript'],
    image: 'assets/assina-ai/cover.webp',
    imageAlt: 'Composição de capturas reais do Assina AI: esteira de conversão e mapa da eficiência, com dados demonstrativos.',
    caseUrl: 'assina-ai.html'
  },
  {
    title: 'Relatório Supers',
    category: 'APLICAÇÃO DESKTOP / TRATAMENTO DE DADOS',
    description: 'Uma ferramenta Python que transforma bases de propostas em relatórios Excel de não assinados, cancelados e apuração. O tratamento identifica cada cliente pela chave correta e considera sua proposta mais recente.',
    stack: ['Python', 'Pandas', 'OpenPyXL', 'CustomTkinter'],
    image: 'assets/relatorio-supers/cover.webp',
    imageAlt: 'Arte editorial do fluxo real do Relatório Supers: arquivos de entrada, critério por ID e data, relatório Excel.',
    caseUrl: 'relatorio-supers.html'
  },
  {
    title: 'Luzia Amélia Noivas',
    category: 'LANDING PAGE / DESIGN RESPONSIVO',
    description: 'Uma apresentação editorial de vestidos, com acervo visual, orientação para a prova e contato contextual.',
    stack: ['HTML', 'CSS', 'JavaScript', 'Design responsivo'],
    image: 'assets/luzia-amelia/cover.webp',
    imageAlt: 'Composição de capturas reais desktop e mobile da demonstração Luzia Amélia.',
    caseUrl: 'luzia-amelia.html'
  }
];

const projectLanguage = document.documentElement.lang.toLowerCase().startsWith('pl') ? 'pl' : document.documentElement.lang.toLowerCase().startsWith('en') ? 'en' : 'pt';
const projectTranslations = {
  en: [
    {category:'DATA / AUTOMATION / WEB PRODUCT',description:'From proposal collection to operational insight: a system with a conversion pipeline, management views, exports, and efficiency diagnostics. Python connects the datasets; Google Apps Script delivers the web experience.',imageAlt:'Real Assina AI screens showing the conversion pipeline and efficiency map with demonstration data.'},
    {category:'DESKTOP APPLICATION / DATA PROCESSING',description:'A Python tool that turns proposal datasets into Excel reports for unsigned, canceled, and audited records. It identifies each customer by the correct key and considers the latest proposal.',imageAlt:'Editorial view of Relatório Supers: source files, ID and date criteria, and the resulting Excel report.'},
    {category:'LANDING PAGE / RESPONSIVE DESIGN',description:'An editorial presentation of bridal dresses with a visual collection, fitting guidance, and contextual contact.',imageAlt:'Desktop and mobile screens from the Luzia Amélia demonstration.'}
  ],
  pl: [
    {category:'DANE / AUTOMATYZACJA / PRODUKT WEBOWY',description:'Od zbierania wniosków po pełny obraz operacji: system z lejkiem konwersji, widokami zarządczymi, eksportem danych i diagnostyką efektywności. Python łączy źródła danych, a Google Apps Script dostarcza interfejs webowy.',imageAlt:'Ekrany Assina AI przedstawiające lejek konwersji i mapę efektywności na danych demonstracyjnych.'},
    {category:'APLIKACJA DESKTOPOWA / PRZETWARZANIE DANYCH',description:'Narzędzie w Pythonie, które przekształca bazy wniosków w raporty Excela dotyczące niepodpisanych, anulowanych i zweryfikowanych rekordów. Rozpoznaje klienta po właściwym kluczu i uwzględnia jego najnowszy wniosek.',imageAlt:'Przepływ Relatório Supers: pliki źródłowe, kryteria ID i daty oraz wynikowy raport w Excelu.'},
    {category:'LANDING PAGE / PROJEKT RESPONSYWNY',description:'Elegancka prezentacja sukien ślubnych z rozbudowaną warstwą wizualną, wskazówkami dotyczącymi przymiarki i intuicyjną ścieżką kontaktu.',imageAlt:'Widoki desktopowy i mobilny demonstracyjnej strony Luzia Amélia.'}
  ]
};
if (projectTranslations[projectLanguage]) window.portfolioProjects = window.portfolioProjects.map((project,index)=>({...project,...projectTranslations[projectLanguage][index]}));

// Business outcomes reported for Assina AI; other entries describe demonstrated capabilities.
const projectOutcomes = {
 pt: [
  'Resultado observado: tempo poupado, menos etapas manuais e recuperação de casos parados que contribuíram para aumentar o volume financeiro.',
  'Melhoria entregue: preparação automatizada de Excel e classificação pela proposta mais recente, sem unir clientes pelo CPF mascarado.',
  'Conceito entregue: contato que já identifica o vestido escolhido, preservando o contexto da navegação até a conversa.'
 ],
 en: [
  'Observed outcome: saved time, fewer manual steps, and recovery of stalled cases that contributed to a higher volume of financial activity.',
  'Delivered improvement: automated Excel preparation and latest-proposal classification without merging customers on masked tax IDs.',
  'Delivered concept: dress-specific contact links that carry browsing context into the fitting conversation.'
 ],
 pl: [
  'Zaobserwowany efekt: mniej ręcznej pracy, oszczędność czasu i ponowna obsługa spraw, które utknęły, co przyczyniło się do wzrostu skali działalności finansowej.',
  'Wdrożone usprawnienie: automatyczne przygotowanie raportów Excel i klasyfikacja według najnowszego wniosku, bez łączenia klientów po zamaskowanym identyfikatorze.',
  'Gotowa koncepcja: kontakt z informacją o wybranej sukni, który zachowuje kontekst od przeglądania kolekcji do rozmowy.'
 ]
};
window.portfolioProjects = window.portfolioProjects.map((project,index)=>({
 ...project, result:projectOutcomes[projectLanguage][index],
 stack:(project.stack||[]).map(tag=>projectLanguage==='pt'?tag:({'Gestão de conteúdo':'Content management','Qualidade':'Quality','Design responsivo':'Responsive design','Auditoria':'Audit','Diagnósticos':'Diagnostics','Desenvolvimento web':'Web development'}[tag]||tag)),
 caseUrl:project.caseUrl && projectLanguage!=='pt' ? project.caseUrl.replace('.html','-en.html') : project.caseUrl
}));
