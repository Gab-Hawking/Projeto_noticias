/* ============================================================
   NewsFilter — app.js
   API: GNews (https://gnews.io) — chave gratuita em gnews.io
   ============================================================ */

'use strict';

/* ── CONFIG ──────────────────────────────────────────────── */

const REGIONS = [
  // América do Sul
  { id: 'br', label: 'Brasil',         group: 'América do Sul', country: 'br', lang: 'pt', icon: '🇧🇷' },
  { id: 'ar', label: 'Argentina',      group: 'América do Sul', country: 'ar', lang: 'es', icon: '🇦🇷' },
  { id: 'cl', label: 'Chile',          group: 'América do Sul', country: 'cl', lang: 'es', icon: '🇨🇱' },
  { id: 'co', label: 'Colômbia',       group: 'América do Sul', country: 'co', lang: 'es', icon: '🇨🇴' },
  { id: 'pe', label: 'Peru',           group: 'América do Sul', country: 'pe', lang: 'es', icon: '🇵🇪' },
  { id: 'sa', label: 'América do Sul', group: 'América do Sul', query: 'venezuela OR bolivia OR ecuador OR paraguay OR uruguay OR "guiana" OR suriname', lang: 'en', icon: '🌎' },
  // Américas
  { id: 'us', label: 'Estados Unidos', group: 'Américas', country: 'us', lang: 'en', icon: '🇺🇸' },
  { id: 'ca', label: 'Canadá',         group: 'Américas', country: 'ca', lang: 'en', icon: '🇨🇦' },
  { id: 'mx', label: 'México',         group: 'Américas', country: 'mx', lang: 'es', icon: '🇲🇽' },
  { id: 'am', label: 'Américas',       group: 'Américas', query: '"central america" OR caribbean OR cuba OR haiti OR panama OR "costa rica" OR honduras OR nicaragua OR "el salvador" OR jamaica', lang: 'en', icon: '🌎' },
  // Europa
  { id: 'gb', label: 'Inglaterra',     group: 'Europa', country: 'gb', lang: 'en', icon: '🇬🇧' },
  { id: 'es', label: 'Espanha',        group: 'Europa', country: 'es', lang: 'es', icon: '🇪🇸' },
  { id: 'de', label: 'Alemanha',       group: 'Europa', country: 'de', lang: 'en', icon: '🇩🇪' },
  { id: 'fr', label: 'França',         group: 'Europa', country: 'fr', lang: 'en', icon: '🇫🇷' },
  { id: 'it', label: 'Itália',         group: 'Europa', country: 'it', lang: 'en', icon: '🇮🇹' },
  { id: 'pt', label: 'Portugal',       group: 'Europa', country: 'pt', lang: 'pt', icon: '🇵🇹' },
  { id: 'eu', label: 'Europa',         group: 'Europa', query: 'europe OR netherlands OR sweden OR norway OR switzerland OR poland OR ukraine OR austria OR belgium OR denmark OR finland OR greece OR romania', lang: 'en', icon: '🇪🇺' },
  // Ásia
  { id: 'jp', label: 'Japão',          group: 'Ásia', country: 'jp', lang: 'en', icon: '🇯🇵' },
  { id: 'kr', label: 'Coreia do Sul',  group: 'Ásia', country: 'kr', lang: 'en', icon: '🇰🇷' },
  { id: 'cn', label: 'China',          group: 'Ásia', country: 'cn', lang: 'en', icon: '🇨🇳' },
  { id: 'me', label: 'Oriente Médio',  group: 'Oriente Médio', query: '"middle east" OR israel OR palestine OR iran OR iraq OR "saudi arabia" OR turkey OR syria OR lebanon OR jordan OR yemen OR egypt', lang: 'en', icon: '🌍' },
  // África & Oceania
  { id: 'af', label: 'África',         group: 'África', query: 'africa OR nigeria OR kenya OR "south africa" OR ethiopia OR ghana OR tanzania OR angola OR mozambique OR senegal', lang: 'en', icon: '🌍' },
  { id: 'au', label: 'Austrália',      group: 'Oceania', country: 'au', lang: 'en', icon: '🇦🇺' },
  { id: 'oc', label: 'Oceania',        group: 'Oceania', query: 'oceania OR "new zealand" OR fiji OR "pacific islands" OR papua OR samoa OR vanuatu OR tonga', lang: 'en', icon: '🌏' },
];

const PERIODS = [
  { id: 'today',   label: 'Hoje',           days: 2  },
  { id: 'week',    label: 'Esta Semana',     days: 7  },
  { id: 'month',   label: 'Este Mês',        days: 30 },
  { id: 'quarter', label: 'Este Trimestre',  days: 90 },
  { id: 'year',    label: 'Este Ano',        days: 365 },
];

const SUBJECTS = [
  { id: 'politica',        label: 'Política',                      icon: '🏛️', topic: 'nation',        query: 'politics government election democracy' },
  { id: 'economia',        label: 'Economia',                      icon: '📊', topic: 'business',      query: 'economy economic GDP recession trade' },
  { id: 'financas',        label: 'Mercados e Finanças',           icon: '💹', topic: 'business',      query: 'markets finance stocks investment banking' },
  { id: 'ia',              label: 'Inteligência Artificial',       icon: '🤖', topic: 'technology',    query: '"artificial intelligence" AI "machine learning" ChatGPT LLM' },
  { id: 'tecnologia',      label: 'Tecnologia',                   icon: '💻', topic: 'technology',    query: 'technology tech innovation software startup' },
  { id: 'saude',           label: 'Saúde',                         icon: '🏥', topic: 'health',        query: 'health medical medicine hospital disease treatment' },
  { id: 'clima',           label: 'Clima e Meio Ambiente',         icon: '🌍', topic: 'science',       query: 'climate environment "global warming" sustainability energy' },
  { id: 'ciencia',         label: 'Ciência e Espaço',             icon: '🔭', topic: 'science',       query: 'science space astronomy NASA research discovery' },
  { id: 'esportes',        label: 'Esportes',                      icon: '⚽', topic: 'sports',        query: 'sports football soccer basketball tennis Olympics' },
  { id: 'entretenimento',  label: 'Entretenimento e Cultura Pop',  icon: '🎬', topic: 'entertainment', query: 'entertainment film music celebrity culture pop' },
  { id: 'crime',           label: 'Crime, Justiça e Segurança',   icon: '⚖️', topic: 'nation',        query: 'crime justice security police court law' },
];

const PLACEHOLDER_IMAGES = {
  politica:       'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&q=80',
  economia:       'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
  financas:       'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
  ia:             'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
  tecnologia:     'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
  saude:          'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&q=80',
  clima:          'https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=800&q=80',
  ciencia:        'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80',
  esportes:       'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
  entretenimento: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
  crime:          'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80',
  default:        'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80',
};

/* Demo data — shown when no API key is configured */
const DEMO_ARTICLES = [
  {
    title: 'Banco Central eleva taxa de juros para conter inflação',
    description: 'Em reunião do Copom, membros decidiram por unanimidade ajustar a Selic em 0,5 ponto percentual, atingindo o maior patamar em dois anos.',
    url: '#',
    image: PLACEHOLDER_IMAGES.economia,
    publishedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    source: { name: 'Valor Econômico' },
    region: 'br',
    subject: 'economia',
  },
  {
    title: "OpenAI anuncia novo modelo com raciocínio avançado",
    description: 'O modelo apresenta capacidade inédita de planejamento em múltiplas etapas e foi benchmarked contra os melhores sistemas acadêmicos do mundo.',
    url: '#',
    image: PLACEHOLDER_IMAGES.ia,
    publishedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    source: { name: 'The Verge' },
    region: 'us',
    subject: 'ia',
  },
  {
    title: 'Missão lunar da NASA coleta primeiras amostras do polo sul',
    description: 'Cientistas celebram o sucesso da operação que retorna material geológico nunca antes analisado, potencialmente revelando a história da água na Lua.',
    url: '#',
    image: PLACEHOLDER_IMAGES.ciencia,
    publishedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    source: { name: 'Reuters' },
    region: 'us',
    subject: 'ciencia',
  },
  {
    title: 'Copa do Mundo 2026: Brasil confirma elenco e calendário de preparação',
    description: 'A CBF divulgou a lista de convocados e o cronograma completo de treinamentos antes do torneio no Canada, EUA e México.',
    url: '#',
    image: PLACEHOLDER_IMAGES.esportes,
    publishedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    source: { name: 'ESPN Brasil' },
    region: 'br',
    subject: 'esportes',
  },
  {
    title: 'Parlamento Europeu debate nova regulamentação sobre IA',
    description: 'Votação histórica estabelece exigências de transparência para sistemas de alto risco e pode servir de modelo para outras jurisdições.',
    url: '#',
    image: PLACEHOLDER_IMAGES.politica,
    publishedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    source: { name: 'Financial Times' },
    region: 'eu',
    subject: 'ia',
  },
  {
    title: 'OMS emite alerta sobre resistência antimicrobiana global',
    description: 'Relatório aponta que até 2050 infecções resistentes a antibióticos podem superar o câncer como principal causa de morte no planeta.',
    url: '#',
    image: PLACEHOLDER_IMAGES.saude,
    publishedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    source: { name: 'The Guardian' },
    region: 'me',
    subject: 'saude',
  },
  {
    title: 'Tesla apresenta robotaxi sem volante em demonstração ao vivo',
    description: 'Elon Musk conduziu jornalistas em percurso pela sede da empresa em veículo totalmente autônomo, prometendo lançamento comercial para 2027.',
    url: '#',
    image: PLACEHOLDER_IMAGES.tecnologia,
    publishedAt: new Date(Date.now() - 3600000 * 30).toISOString(),
    source: { name: 'TechCrunch' },
    region: 'us',
    subject: 'tecnologia',
  },
  {
    title: 'Cúpula climática avança em acordo sobre financiamento para países em desenvolvimento',
    description: 'Delegações de 190 países fecharam um fundo de US$ 300 bilhões anuais para adaptação climática nas nações mais vulneráveis.',
    url: '#',
    image: PLACEHOLDER_IMAGES.clima,
    publishedAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    source: { name: 'AP News' },
    region: 'af',
    subject: 'clima',
  },
  {
    title: 'Japão lança satélite de observação de alta resolução',
    description: 'O aparelho orbita a Terra a 600 km de altitude e captará imagens com resolução de 30 centímetros para uso civil e de defesa.',
    url: '#',
    image: PLACEHOLDER_IMAGES.ciencia,
    publishedAt: new Date(Date.now() - 3600000 * 42).toISOString(),
    source: { name: 'Reuters Japan' },
    region: 'jp',
    subject: 'ciencia',
  },
  {
    title: 'Festival de Cannes anuncia seleção oficial com recordes de diversidade',
    description: 'Pela primeira vez na história, metade dos filmes em competição foram dirigidos por mulheres, refletindo uma transformação profunda na indústria.',
    url: '#',
    image: PLACEHOLDER_IMAGES.entretenimento,
    publishedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    source: { name: 'Variety' },
    region: 'fr',
    subject: 'entretenimento',
  },
  {
    title: 'Mercados reagem a dados de emprego nos EUA acima do esperado',
    description: 'S&P 500 fechou em alta de 1,3% após payroll superar previsões em 85.000 vagas, reduzindo expectativas de corte de juros pelo Fed.',
    url: '#',
    image: PLACEHOLDER_IMAGES.financas,
    publishedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    source: { name: 'Financial Times' },
    region: 'us',
    subject: 'financas',
  },
  {
    title: 'Argentina anuncia medidas econômicas para estabilizar o câmbio',
    description: 'O ministro da economia apresentou um pacote de intervenção no mercado de câmbio após o peso acumular queda de 18% no trimestre.',
    url: '#',
    image: PLACEHOLDER_IMAGES.economia,
    publishedAt: new Date(Date.now() - 3600000 * 15).toISOString(),
    source: { name: 'Reuters' },
    region: 'ar',
    subject: 'economia',
  },
];

/* ── STATE ───────────────────────────────────────────────── */
const state = {
  regions:  new Set(),
  period:   'week',
  subjects: new Set(),
  apiKey:   '',
  demoMode: false,
  articles: [],
  loading:  false,
};

/* ── HELPERS ─────────────────────────────────────────────── */
function getRegion(id)  { return REGIONS.find(r => r.id === id); }
function getSubject(id) { return SUBJECTS.find(s => s.id === id); }
function getPeriod(id)  { return PERIODS.find(p => p.id === id); }

function fromDate(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function formatDate(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now - d;
  const diffH = Math.floor(diffMs / 3600000);
  const diffD = Math.floor(diffMs / 86400000);
  if (diffH < 1) return 'agora';
  if (diffH < 24) return `há ${diffH}h`;
  if (diffD === 1) return 'ontem';
  if (diffD < 7) return `há ${diffD} dias`;
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

function buildGNewsURL(subject, region, period) {
  const base  = 'https://gnews.io/api/v4/search';
  const parts = [];

  // Subject query
  if (subject) parts.push(subject.query);

  // Region query or country
  const params = new URLSearchParams();
  if (region) {
    if (region.country) {
      params.set('country', region.country);
      params.set('lang', region.lang);
    } else if (region.query) {
      parts.push(`(${region.query})`);
      params.set('lang', 'en');
    }
  }

  const q = parts.join(' ');
  params.set('q', q || 'news');
  params.set('max', '10');
  params.set('from', fromDate(period.days));
  params.set('sortby', 'publishedAt');
  params.set('apikey', state.apiKey);

  return `${base}?${params.toString()}`;
}

async function fetchNews() {
  if (state.demoMode) return filterDemoArticles();

  const selectedRegions  = state.regions.size  > 0 ? [...state.regions].map(getRegion)  : [null];
  const selectedSubjects = state.subjects.size > 0 ? [...state.subjects].map(getSubject) : [null];
  const period = getPeriod(state.period);

  const combinations = [];
  for (const region of selectedRegions) {
    for (const subject of selectedSubjects) {
      combinations.push({ region, subject });
    }
  }
  // Limit API calls on free tier (max 5)
  const limited = combinations.slice(0, 5);

  const results = await Promise.allSettled(
    limited.map(({ region, subject }) =>
      fetch(buildGNewsURL(subject, region, period))
        .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
        .then(d => (d.articles || []).map(a => ({
          ...a,
          _regionId:  region?.id  || null,
          _subjectId: subject?.id || null,
        })))
    )
  );

  const seen = new Set();
  const articles = [];
  for (const r of results) {
    if (r.status === 'fulfilled') {
      for (const a of r.value) {
        if (!seen.has(a.url)) { seen.add(a.url); articles.push(a); }
      }
    }
  }

  // Sort by date
  articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  return articles;
}

function filterDemoArticles() {
  let list = [...DEMO_ARTICLES];
  if (state.regions.size  > 0) list = list.filter(a => state.regions.has(a.region));
  if (state.subjects.size > 0) list = list.filter(a => state.subjects.has(a.subject));
  const period = getPeriod(state.period);
  const cutoff = Date.now() - period.days * 86400000;
  list = list.filter(a => new Date(a.publishedAt) >= cutoff);
  return list;
}

/* ── RENDER ──────────────────────────────────────────────── */
function renderCard(article) {
  const regionId  = article._regionId  || article.region;
  const subjectId = article._subjectId || article.subject;
  const region    = regionId  ? getRegion(regionId)  : null;
  const subject   = subjectId ? getSubject(subjectId) : null;
  const placeholder = PLACEHOLDER_IMAGES[subjectId] || PLACEHOLDER_IMAGES.default;

  const card = document.createElement('article');
  card.className = 'card';

  const imageSrc = article.image || placeholder;

  card.innerHTML = `
    <div class="card-image-wrap">
      <img
        class="card-image"
        src="${escHtml(imageSrc)}"
        alt="${escHtml(article.title)}"
        loading="lazy"
        onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
      />
      <div class="card-image-placeholder" style="display:none">
        <span>${subject?.icon || '📰'}</span>
        <span>${subject?.label || 'Notícia'}</span>
      </div>
      <div class="card-source-badge">
        <span class="source-dot"></span>
        ${escHtml(article.source?.name || 'Fonte desconhecida')}
      </div>
    </div>

    <div class="card-body">
      <div class="card-badges">
        ${region  ? `<span class="badge badge-region">${region.icon} ${escHtml(region.label)}</span>`  : ''}
        ${subject ? `<span class="badge badge-subject">${subject.icon} ${escHtml(subject.label)}</span>` : ''}
      </div>
      <h2 class="card-title">${escHtml(article.title)}</h2>
      ${article.description ? `<p class="card-desc">${escHtml(article.description)}</p>` : ''}
    </div>

    <div class="card-footer">
      <div class="card-meta">
        <span class="card-source-name">${escHtml(article.source?.name || '')}</span>
        <span class="card-date">${formatDate(article.publishedAt)}</span>
      </div>
      <a class="card-link"
         href="${escHtml(article.url)}"
         target="_blank"
         rel="noopener noreferrer"
         aria-label="Ler notícia completa">
        Ler
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
          <polyline points="15 3 21 3 21 9"/>
          <line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
      </a>
    </div>
  `;

  return card;
}

function renderSkeletons(n = 6) {
  return Array.from({ length: n }, () => {
    const el = document.createElement('div');
    el.className = 'skeleton-card';
    el.innerHTML = `
      <div class="skel skel-image"></div>
      <div class="skel-body">
        <div class="skel-badges"><div class="skel skel-badge"></div><div class="skel skel-badge"></div></div>
        <div class="skel skel-title"></div>
        <div class="skel skel-title-2"></div>
        <div class="skel skel-desc"></div>
        <div class="skel skel-desc-2"></div>
        <div class="skel skel-desc-3"></div>
      </div>
      <div class="skel skel-footer"></div>
    `;
    return el;
  });
}

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ── UI BUILDING ─────────────────────────────────────────── */
function buildSidebar() {
  buildRegionFilters();
  buildPeriodFilters();
  buildSubjectFilters();
}

function buildRegionFilters() {
  const body = document.getElementById('regionBody');
  const groups = {};
  for (const r of REGIONS) {
    if (!groups[r.group]) groups[r.group] = [];
    groups[r.group].push(r);
  }
  for (const [group, items] of Object.entries(groups)) {
    const lbl = document.createElement('div');
    lbl.className = 'filter-group-label';
    lbl.textContent = group;
    body.appendChild(lbl);

    for (const r of items) {
      body.appendChild(createCheckItem('region', r.id, `${r.icon} ${r.label}`, state.regions.has(r.id)));
    }
    const div = document.createElement('div');
    div.className = 'divider';
    body.appendChild(div);
  }
}

function buildPeriodFilters() {
  const body = document.getElementById('periodBody');
  for (const p of PERIODS) {
    body.appendChild(createRadioItem('period', p.id, p.label, state.period === p.id));
  }
}

function buildSubjectFilters() {
  const body = document.getElementById('subjectBody');
  for (const s of SUBJECTS) {
    body.appendChild(createCheckItem('subject', s.id, `${s.icon} ${s.label}`, state.subjects.has(s.id)));
  }
}

function createCheckItem(type, id, label, checked) {
  const item = document.createElement('label');
  item.className = 'filter-item';
  item.innerHTML = `
    <input type="checkbox" data-type="${type}" data-id="${id}" ${checked ? 'checked' : ''} />
    <span class="filter-item-label">${label}</span>
  `;
  return item;
}

function createRadioItem(type, id, label, checked) {
  const item = document.createElement('label');
  item.className = 'filter-item';
  item.innerHTML = `
    <input type="radio" name="${type}" data-type="${type}" data-id="${id}" ${checked ? 'checked' : ''} />
    <span class="filter-item-label">${label}</span>
  `;
  return item;
}

function updateFilterTags() {
  const bar  = document.getElementById('filtersBar');
  const tags = document.getElementById('filterTags');
  tags.innerHTML = '';

  const all = [
    ...[...state.regions ].map(id => ({ id, type: 'region',  label: getRegion(id)?.label  || id })),
    ...[...state.subjects].map(id => ({ id, type: 'subject', label: getSubject(id)?.label || id })),
    { id: state.period, type: 'period', label: getPeriod(state.period)?.label || state.period },
  ];

  for (const item of all) {
    const tag = document.createElement('span');
    tag.className = 'filter-tag';
    tag.innerHTML = `
      ${escHtml(item.label)}
      <span class="filter-tag-remove" data-type="${item.type}" data-id="${item.id}" title="Remover">✕</span>
    `;
    tags.appendChild(tag);
  }

  bar.hidden = false;
}

function updateResultsMeta(count) {
  const meta  = document.getElementById('resultsMeta');
  const cnt   = document.getElementById('resultsCount');
  const range = document.getElementById('resultsRange');

  cnt.innerHTML   = `<strong>${count}</strong> notícia${count !== 1 ? 's' : ''} encontrada${count !== 1 ? 's' : ''}`;
  range.textContent = state.demoMode ? '(modo demonstração)' : '';
  meta.hidden = false;
}

/* ── SEARCH FLOW ─────────────────────────────────────────── */
async function performSearch() {
  if (!state.apiKey && !state.demoMode) {
    showModal();
    return;
  }

  setLoading(true);
  updateFilterTags();

  try {
    const articles = await fetchNews();
    state.articles = articles;
    renderResults(articles);
  } catch (err) {
    showErrorState(err.message || 'Erro ao buscar notícias.');
  } finally {
    setLoading(false);
  }
}

function renderResults(articles) {
  const grid  = document.getElementById('cardsGrid');
  const state_container = document.getElementById('stateContainer');
  grid.innerHTML = '';

  if (articles.length === 0) {
    state_container.classList.remove('hidden');
    document.getElementById('initialState').hidden = true;
    document.getElementById('loadingState').hidden  = true;
    document.getElementById('emptyState').hidden    = false;
    document.getElementById('errorState').hidden    = true;
    updateResultsMeta(0);
    return;
  }

  state_container.classList.add('hidden');
  updateResultsMeta(articles.length);

  const frag = document.createDocumentFragment();
  for (const a of articles) frag.appendChild(renderCard(a));
  grid.appendChild(frag);
}

function setLoading(on) {
  state.loading = on;
  const grid  = document.getElementById('cardsGrid');
  const state_container = document.getElementById('stateContainer');
  const btn   = document.getElementById('searchBtn');

  if (on) {
    grid.innerHTML = '';
    document.getElementById('resultsMeta').hidden = true;
    state_container.classList.remove('hidden');
    document.getElementById('initialState').hidden = true;
    document.getElementById('loadingState').hidden  = false;
    document.getElementById('emptyState').hidden    = true;
    document.getElementById('errorState').hidden    = true;
    btn.disabled = true;
    btn.textContent = 'Buscando…';

    // Render skeletons
    const skelGrid = document.getElementById('skeletonGrid');
    skelGrid.innerHTML = '';
    renderSkeletons(6).forEach(s => skelGrid.appendChild(s));
  } else {
    state_container.classList.add('hidden');
    btn.disabled = false;
    btn.textContent = 'Buscar Notícias';
  }
}

function showErrorState(msg) {
  const grid  = document.getElementById('cardsGrid');
  const container = document.getElementById('stateContainer');
  grid.innerHTML = '';
  container.classList.remove('hidden');
  document.getElementById('initialState').hidden = true;
  document.getElementById('loadingState').hidden  = true;
  document.getElementById('emptyState').hidden    = true;
  document.getElementById('errorState').hidden    = false;
  document.getElementById('errorMessage').textContent = msg;
}

/* ── MODAL ───────────────────────────────────────────────── */
function showModal() {
  const overlay = document.getElementById('modalOverlay');
  const input   = document.getElementById('apiKeyInput');
  overlay.classList.remove('hidden');
  input.value = state.apiKey || '';
  setTimeout(() => input.focus(), 100);
}
function hideModal() {
  document.getElementById('modalOverlay').classList.add('hidden');
}

function saveApiKey() {
  const val = document.getElementById('apiKeyInput').value.trim();
  if (!val) { showToast('Cole uma chave de API válida.', 'warning'); return; }
  state.apiKey   = val;
  state.demoMode = false;
  localStorage.setItem('nf_apikey', val);
  updateApiStatus();
  hideModal();
  showToast('Chave de API salva com sucesso!', 'success');
}

function enableDemoMode() {
  state.demoMode = true;
  state.apiKey   = '';
  localStorage.removeItem('nf_apikey');
  updateApiStatus();
  hideModal();
  showToast('Modo demonstração ativado.', 'success');
}

function updateApiStatus() {
  const badge = document.getElementById('apiBadge');
  if (state.demoMode) {
    badge.className = 'api-badge not-configured';
    badge.innerHTML = `<span class="api-dot pulse"></span> Demo`;
  } else if (state.apiKey) {
    badge.className = 'api-badge configured';
    badge.innerHTML = `<span class="api-dot"></span> API Configurada`;
  } else {
    badge.className = 'api-badge not-configured';
    badge.innerHTML = `<span class="api-dot pulse"></span> Configurar API`;
  }
}

/* ── TOAST ───────────────────────────────────────────────── */
let toastTimer = null;
function showToast(msg, type = '') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = `toast ${type}`;
  toast.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add('hidden'), 3500);
}

/* ── SIDEBAR (mobile) ────────────────────────────────────── */
function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebarOverlay').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.add('hidden');
  document.body.style.overflow = '';
}

/* ── EVENTS ──────────────────────────────────────────────── */
function attachEvents() {
  // Filter changes
  document.getElementById('sidebar').addEventListener('change', e => {
    const input = e.target;
    const type  = input.dataset.type;
    const id    = input.dataset.id;
    if (!type || !id) return;
    if (type === 'region') {
      if (input.checked) state.regions.add(id);
      else state.regions.delete(id);
    } else if (type === 'subject') {
      if (input.checked) state.subjects.add(id);
      else state.subjects.delete(id);
    } else if (type === 'period') {
      state.period = id;
    }
  });

  // Collapsible sections
  document.querySelectorAll('.filter-section-header').forEach(header => {
    header.addEventListener('click', () => {
      header.closest('.filter-section').classList.toggle('collapsed');
    });
  });

  // Search button
  document.getElementById('searchBtn').addEventListener('click', performSearch);

  // Clear button
  document.getElementById('clearBtn').addEventListener('click', () => {
    state.regions.clear();
    state.subjects.clear();
    state.period = 'week';
    // Reset checkboxes
    document.querySelectorAll('[data-type="region"], [data-type="subject"]').forEach(i => (i.checked = false));
    document.querySelectorAll('[data-type="period"]').forEach(i => (i.checked = i.dataset.id === 'week'));
    document.getElementById('filtersBar').hidden = true;
    showToast('Filtros limpos.');
  });

  // Filter tag removal
  document.getElementById('filterTags').addEventListener('click', e => {
    const btn  = e.target.closest('.filter-tag-remove');
    if (!btn) return;
    const { type, id } = btn.dataset;
    if (type === 'region')  { state.regions.delete(id); updateCheckbox('region', id, false); }
    if (type === 'subject') { state.subjects.delete(id); updateCheckbox('subject', id, false); }
    if (type === 'period')  { /* period always has a value */ return; }
    updateFilterTags();
  });

  // Clear all tags
  document.getElementById('clearAllTagsBtn').addEventListener('click', () => {
    document.getElementById('clearBtn').click();
  });

  // Retry
  document.getElementById('retryBtn').addEventListener('click', performSearch);

  // Mobile sidebar
  document.getElementById('filterToggle').addEventListener('click', openSidebar);
  document.getElementById('sidebarClose').addEventListener('click', closeSidebar);
  document.getElementById('sidebarOverlay').addEventListener('click', closeSidebar);

  // API modal
  document.getElementById('apiBadge').addEventListener('click', () => {
    if (!state.apiKey) showModal();
    else showModal();
  });
  document.getElementById('modalOverlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modalOverlay')) hideModal();
  });
  document.getElementById('modalClose').addEventListener('click', hideModal);
  document.getElementById('cancelModalBtn').addEventListener('click', hideModal);
  document.getElementById('saveApiKeyBtn').addEventListener('click', saveApiKey);
  document.getElementById('demoModeBtn').addEventListener('click', enableDemoMode);
  document.getElementById('apiKeyInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') saveApiKey();
  });

  // Demo link on initial state
  document.getElementById('demoLinkBtn')?.addEventListener('click', e => {
    e.preventDefault();
    enableDemoMode();
  });

  // Change key button (error state)
  document.getElementById('changeKeyBtn')?.addEventListener('click', showModal);

  // Second retry button
  document.getElementById('retryBtn2')?.addEventListener('click', performSearch);

  // Keyboard: close modal/sidebar on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      hideModal();
      closeSidebar();
    }
  });
}

function updateCheckbox(type, id, checked) {
  const el = document.querySelector(`[data-type="${type}"][data-id="${id}"]`);
  if (el) el.checked = checked;
}

/* ── INIT ────────────────────────────────────────────────── */
function init() {
  // Load API key from storage
  const stored = localStorage.getItem('nf_apikey');
  if (stored) { state.apiKey = stored; }

  buildSidebar();
  attachEvents();
  updateApiStatus();

  // If no key, show prompt after brief delay
  if (!state.apiKey) {
    setTimeout(showModal, 800);
  }
}

document.addEventListener('DOMContentLoaded', init);
