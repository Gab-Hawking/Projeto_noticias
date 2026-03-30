/* ============================================================
   NewsFilter — app.js
   Fonte: Google News RSS (gratuito, sem chave de API)
   Proxy CORS: allorigins.win / corsproxy.io (fallback)
   ============================================================ */

'use strict';

/* ── CORS PROXIES ─────────────────────────────────────────── */
// Tentados em ordem; primeiro que responder é usado
const PROXIES = [
  url => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
  url => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  url => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
];

/* ── CONFIG ──────────────────────────────────────────────── */

// Mapeamento de região → locale do Google News
const REGION_LOCALE = {
  br: { hl: 'pt-BR',  gl: 'BR', ceid: 'BR:pt-BR' },
  ar: { hl: 'es-419', gl: 'AR', ceid: 'AR:es-419' },
  cl: { hl: 'es-419', gl: 'CL', ceid: 'CL:es-419' },
  co: { hl: 'es-419', gl: 'CO', ceid: 'CO:es-419' },
  pe: { hl: 'es-419', gl: 'PE', ceid: 'PE:es-419' },
  sa: { hl: 'pt-BR',  gl: 'BR', ceid: 'BR:pt-BR' },  // macro: query via texto
  us: { hl: 'en-US',  gl: 'US', ceid: 'US:en' },
  ca: { hl: 'en-CA',  gl: 'CA', ceid: 'CA:en' },
  mx: { hl: 'es-419', gl: 'MX', ceid: 'MX:es-419' },
  am: { hl: 'en-US',  gl: 'US', ceid: 'US:en' },
  gb: { hl: 'en-GB',  gl: 'GB', ceid: 'GB:en' },
  es: { hl: 'es',     gl: 'ES', ceid: 'ES:es' },
  de: { hl: 'de',     gl: 'DE', ceid: 'DE:de' },
  fr: { hl: 'fr',     gl: 'FR', ceid: 'FR:fr' },
  it: { hl: 'it',     gl: 'IT', ceid: 'IT:it' },
  pt: { hl: 'pt-PT',  gl: 'PT', ceid: 'PT:pt-PT' },
  eu: { hl: 'en-GB',  gl: 'GB', ceid: 'GB:en' },
  jp: { hl: 'ja',     gl: 'JP', ceid: 'JP:ja' },
  kr: { hl: 'ko',     gl: 'KR', ceid: 'KR:ko' },
  cn: { hl: 'zh-CN',  gl: 'CN', ceid: 'CN:zh-CN' },
  me: { hl: 'en-US',  gl: 'US', ceid: 'US:en' },
  af: { hl: 'en-US',  gl: 'US', ceid: 'US:en' },
  au: { hl: 'en-AU',  gl: 'AU', ceid: 'AU:en' },
  oc: { hl: 'en-AU',  gl: 'AU', ceid: 'AU:en' },
};

const REGIONS = [
  // América do Sul
  { id: 'br', label: 'Brasil',         group: 'América do Sul', icon: '🇧🇷' },
  { id: 'ar', label: 'Argentina',      group: 'América do Sul', icon: '🇦🇷' },
  { id: 'cl', label: 'Chile',          group: 'América do Sul', icon: '🇨🇱' },
  { id: 'co', label: 'Colômbia',       group: 'América do Sul', icon: '🇨🇴' },
  { id: 'pe', label: 'Peru',           group: 'América do Sul', icon: '🇵🇪' },
  { id: 'sa', label: 'América do Sul', group: 'América do Sul', icon: '🌎', extraQ: 'venezuela OR bolivia OR ecuador OR paraguay OR uruguay OR "america do sul"' },
  // Américas
  { id: 'us', label: 'Estados Unidos', group: 'Américas', icon: '🇺🇸' },
  { id: 'ca', label: 'Canadá',         group: 'Américas', icon: '🇨🇦' },
  { id: 'mx', label: 'México',         group: 'Américas', icon: '🇲🇽' },
  { id: 'am', label: 'Américas',       group: 'Américas', icon: '🌎', extraQ: '"central america" OR caribbean OR cuba OR panama OR "costa rica" OR jamaica' },
  // Europa
  { id: 'gb', label: 'Inglaterra',     group: 'Europa', icon: '🇬🇧' },
  { id: 'es', label: 'Espanha',        group: 'Europa', icon: '🇪🇸' },
  { id: 'de', label: 'Alemanha',       group: 'Europa', icon: '🇩🇪' },
  { id: 'fr', label: 'França',         group: 'Europa', icon: '🇫🇷' },
  { id: 'it', label: 'Itália',         group: 'Europa', icon: '🇮🇹' },
  { id: 'pt', label: 'Portugal',       group: 'Europa', icon: '🇵🇹' },
  { id: 'eu', label: 'Europa',         group: 'Europa', icon: '🇪🇺', extraQ: 'europe OR netherlands OR sweden OR norway OR switzerland OR poland OR ukraine OR belgium' },
  // Ásia
  { id: 'jp', label: 'Japão',          group: 'Ásia', icon: '🇯🇵' },
  { id: 'kr', label: 'Coreia do Sul',  group: 'Ásia', icon: '🇰🇷' },
  { id: 'cn', label: 'China',          group: 'Ásia', icon: '🇨🇳' },
  { id: 'me', label: 'Oriente Médio',  group: 'Oriente Médio', icon: '🌍', extraQ: '"middle east" OR israel OR iran OR iraq OR "saudi arabia" OR syria OR yemen' },
  // África & Oceania
  { id: 'af', label: 'África',         group: 'África', icon: '🌍', extraQ: 'africa OR nigeria OR kenya OR "south africa" OR ethiopia OR angola OR mozambique' },
  { id: 'au', label: 'Austrália',      group: 'Oceania', icon: '🇦🇺' },
  { id: 'oc', label: 'Oceania',        group: 'Oceania', icon: '🌏', extraQ: 'oceania OR "new zealand" OR fiji OR "pacific islands" OR papua' },
];

const PERIODS = [
  { id: 'today',   label: 'Hoje',           days: 2   },
  { id: 'week',    label: 'Esta Semana',     days: 7   },
  { id: 'month',   label: 'Este Mês',        days: 30  },
  { id: 'quarter', label: 'Este Trimestre',  days: 90  },
  { id: 'year',    label: 'Este Ano',        days: 365 },
];

const SUBJECTS = [
  { id: 'politica',       label: 'Política',                     icon: '🏛️', q: 'politics government election democracy president' },
  { id: 'economia',       label: 'Economia',                     icon: '📊', q: 'economy economic trade growth GDP recession' },
  { id: 'financas',       label: 'Mercados e Finanças',          icon: '💹', q: 'markets finance stocks investment banking inflation' },
  { id: 'ia',             label: 'Inteligência Artificial',      icon: '🤖', q: '"artificial intelligence" AI "machine learning" ChatGPT LLM OpenAI' },
  { id: 'tecnologia',     label: 'Tecnologia',                   icon: '💻', q: 'technology tech innovation software startup' },
  { id: 'saude',          label: 'Saúde',                        icon: '🏥', q: 'health medical medicine hospital disease treatment vaccine' },
  { id: 'clima',          label: 'Clima e Meio Ambiente',        icon: '🌍', q: 'climate environment "global warming" sustainability energy carbon' },
  { id: 'ciencia',        label: 'Ciência e Espaço',            icon: '🔭', q: 'science space astronomy NASA research discovery universe' },
  { id: 'esportes',       label: 'Esportes',                     icon: '⚽', q: 'sports football soccer basketball tennis championship' },
  { id: 'entretenimento', label: 'Entretenimento e Cultura Pop', icon: '🎬', q: 'entertainment film music celebrity culture hollywood' },
  { id: 'crime',          label: 'Crime, Justiça e Segurança',  icon: '⚖️', q: 'crime justice security police court law investigation' },
];

// Imagens Unsplash temáticas por assunto (3 variações cada)
const SUBJECT_IMAGES = {
  politica:       ['photo-1541872703-74c5e44368f9','photo-1555848962-6e79363ec58f','photo-1529107386315-e1a2ed48a620'],
  economia:       ['photo-1611974789855-9c2a0a7236a3','photo-1611095973763-414019e72400','photo-1460925895917-afdab827c52f'],
  financas:       ['photo-1611974789855-9c2a0a7236a3','photo-1590283603385-17ffb3a7f29f','photo-1640340434855-6084b1f4901c'],
  ia:             ['photo-1677442135703-1787eea5ce01','photo-1620712943543-bcc4688e7485','photo-1655720033654-a4239dd42d10'],
  tecnologia:     ['photo-1518770660439-4636190af475','photo-1550751827-4bd374173736','photo-1498050108023-c5249f4df085'],
  saude:          ['photo-1576091160399-112ba8d25d1f','photo-1559757148-5c350d0d3c56','photo-1530497610245-94d3c16cda28'],
  clima:          ['photo-1569163139599-0f4517e36f51','photo-1464822759023-fed622ff2c3b','photo-1451187580459-43490279c0fa'],
  ciencia:        ['photo-1446776811953-b23d57bd21aa','photo-1454789548928-9efd52dc4031','photo-1614313913007-2b4ae8ce32d6'],
  esportes:       ['photo-1461896836934-ffe607ba8211','photo-1579952363873-27f3bade9f55','photo-1504450758481-7338eba7524a'],
  entretenimento: ['photo-1489599849927-2ee91cede3ba','photo-1598899134739-24c46f58b8c0','photo-1514525253161-7a46d19cd819'],
  crime:          ['photo-1589829545856-d10d557cf95f','photo-1436450412740-6b988f486c6b','photo-1507679799987-c73779587ccf'],
  default:        ['photo-1504711434969-e33886168f5c','photo-1495020689067-958852a7765e','photo-1585829365295-ab7cd400c167'],
};

function subjectImage(subjectId, index = 0) {
  const arr = SUBJECT_IMAGES[subjectId] || SUBJECT_IMAGES.default;
  const id  = arr[index % arr.length];
  return `https://images.unsplash.com/${id}?w=800&q=75&fit=crop&auto=format`;
}

/* ── DEMO DATA ────────────────────────────────────────────── */
const DEMO_ARTICLES = [
  { title: 'Banco Central eleva taxa de juros para conter inflação', description: 'Em reunião do Copom, membros decidiram por unanimidade ajustar a Selic em 0,5 ponto percentual, atingindo o maior patamar em dois anos.', url: '#', publishedAt: new Date(Date.now() - 3.6e6 * 2).toISOString(), source: { name: 'Valor Econômico' }, _regionId: 'br', _subjectId: 'economia' },
  { title: 'OpenAI anuncia modelo com raciocínio avançado em múltiplas etapas', description: 'O novo modelo apresenta capacidade inédita de planejamento e foi benchmarked contra os melhores sistemas acadêmicos do mundo.', url: '#', publishedAt: new Date(Date.now() - 3.6e6 * 5).toISOString(), source: { name: 'The Verge' }, _regionId: 'us', _subjectId: 'ia' },
  { title: 'Missão lunar da NASA coleta primeiras amostras do polo sul', description: 'Cientistas celebram o sucesso da operação que retorna material geológico nunca antes analisado, revelando a história da água na Lua.', url: '#', publishedAt: new Date(Date.now() - 3.6e6 * 8).toISOString(), source: { name: 'Reuters' }, _regionId: 'us', _subjectId: 'ciencia' },
  { title: 'Brasil confirma elenco para Copa do Mundo 2026', description: 'A CBF divulgou a lista de convocados e o cronograma completo de treinamentos antes do torneio no Canadá, EUA e México.', url: '#', publishedAt: new Date(Date.now() - 3.6e6 * 12).toISOString(), source: { name: 'ESPN Brasil' }, _regionId: 'br', _subjectId: 'esportes' },
  { title: 'Parlamento Europeu aprova regulamentação histórica sobre IA', description: 'Votação estabelece exigências de transparência para sistemas de alto risco e pode servir de modelo para outras jurisdições globais.', url: '#', publishedAt: new Date(Date.now() - 3.6e6 * 18).toISOString(), source: { name: 'Financial Times' }, _regionId: 'eu', _subjectId: 'ia' },
  { title: 'OMS emite alerta global sobre resistência antimicrobiana', description: 'Relatório aponta que até 2050 infecções resistentes a antibióticos podem superar o câncer como principal causa de morte no planeta.', url: '#', publishedAt: new Date(Date.now() - 3.6e6 * 24).toISOString(), source: { name: 'The Guardian' }, _regionId: 'me', _subjectId: 'saude' },
  { title: 'Tesla apresenta robotaxi sem volante em demonstração ao vivo', description: 'Elon Musk conduziu jornalistas em percurso autônomo, prometendo lançamento comercial para breve.', url: '#', publishedAt: new Date(Date.now() - 3.6e6 * 30).toISOString(), source: { name: 'TechCrunch' }, _regionId: 'us', _subjectId: 'tecnologia' },
  { title: 'Cúpula climática fecha fundo de US$ 300 bi para países em desenvolvimento', description: 'Delegações de 190 países chegaram a acordo histórico para financiamento de adaptação climática nas nações mais vulneráveis.', url: '#', publishedAt: new Date(Date.now() - 3.6e6 * 36).toISOString(), source: { name: 'AP News' }, _regionId: 'af', _subjectId: 'clima' },
  { title: 'Japão lança satélite de observação com resolução de 30 cm', description: 'O aparelho orbita a Terra a 600 km de altitude para uso civil e de defesa, estabelecendo novo padrão tecnológico.', url: '#', publishedAt: new Date(Date.now() - 3.6e6 * 42).toISOString(), source: { name: 'Reuters Japan' }, _regionId: 'jp', _subjectId: 'ciencia' },
  { title: 'Festival de Cannes anuncia recorde de diversidade na seleção oficial', description: 'Pela primeira vez, metade dos filmes em competição foram dirigidos por mulheres, refletindo transformação profunda na indústria.', url: '#', publishedAt: new Date(Date.now() - 3.6e6 * 48).toISOString(), source: { name: 'Variety' }, _regionId: 'fr', _subjectId: 'entretenimento' },
  { title: 'Mercados reagem a dados de emprego nos EUA acima do esperado', description: 'S&P 500 fechou em alta de 1,3% após payroll superar previsões em 85.000 vagas, reduzindo expectativas de corte de juros.', url: '#', publishedAt: new Date(Date.now() - 3.6e6 * 6).toISOString(), source: { name: 'Financial Times' }, _regionId: 'us', _subjectId: 'financas' },
  { title: 'Argentina anuncia pacote para estabilizar câmbio após queda do peso', description: 'O ministro da economia apresentou intervenção no mercado cambial após o peso acumular queda de 18% no trimestre.', url: '#', publishedAt: new Date(Date.now() - 3.6e6 * 15).toISOString(), source: { name: 'Reuters' }, _regionId: 'ar', _subjectId: 'economia' },
];

/* ── STATE ───────────────────────────────────────────────── */
const state = {
  regions:  new Set(),
  period:   'week',
  subjects: new Set(),
  articles: [],
  loading:  false,
};

/* ── HELPERS ─────────────────────────────────────────────── */
const getRegion  = id => REGIONS.find(r => r.id === id);
const getSubject = id => SUBJECTS.find(s => s.id === id);
const getPeriod  = id => PERIODS.find(p => p.id === id);

function isoFromDaysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

function formatDate(iso) {
  const d    = new Date(iso);
  const diffH = Math.floor((Date.now() - d) / 3.6e6);
  const diffD = Math.floor(diffH / 24);
  if (diffH < 1)  return 'agora';
  if (diffH < 24) return `há ${diffH}h`;
  if (diffD === 1) return 'ontem';
  if (diffD < 7)  return `há ${diffD} dias`;
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

function escHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/* ── DIRECT RSS FEEDS ────────────────────────────────────── */
// Feeds diretos por assunto — filtrados por palavras-chave no cliente
const DIRECT_FEEDS = {
  politica: [
    { url: 'http://feeds.bbci.co.uk/news/world/rss.xml',         name: 'BBC World' },
    { url: 'https://www.theguardian.com/world/rss',               name: 'The Guardian' },
    { url: 'https://www.aljazeera.com/xml/rss/all.xml',           name: 'Al Jazeera' },
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml', name: 'NY Times' },
    { url: 'https://feeds.npr.org/1004/rss.xml',                  name: 'NPR Politics' },
  ],
  economia: [
    { url: 'http://feeds.bbci.co.uk/news/business/rss.xml',       name: 'BBC Business' },
    { url: 'https://www.theguardian.com/business/economics/rss',  name: 'The Guardian' },
    { url: 'https://feeds.a.dj.com/rss/RSSMarketsMain.xml',       name: 'WSJ Markets' },
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Economy.xml', name: 'NY Times' },
  ],
  financas: [
    { url: 'http://feeds.bbci.co.uk/news/business/rss.xml',       name: 'BBC Business' },
    { url: 'https://www.theguardian.com/business/markets/rss',    name: 'Guardian Markets' },
    { url: 'https://feeds.a.dj.com/rss/RSSMarketsMain.xml',       name: 'WSJ Markets' },
    { url: 'https://feeds.content.dowjones.io/public/rss/mw_realtimeheadlines', name: 'MarketWatch' },
  ],
  ia: [
    { url: 'https://techcrunch.com/feed/',                         name: 'TechCrunch' },
    { url: 'https://www.theverge.com/rss/index.xml',               name: 'The Verge' },
    { url: 'https://feeds.arstechnica.com/arstechnica/index',      name: 'Ars Technica' },
    { url: 'http://feeds.bbci.co.uk/news/technology/rss.xml',      name: 'BBC Tech' },
    { url: 'https://www.wired.com/feed/rss',                       name: 'Wired' },
    { url: 'https://venturebeat.com/feed/',                        name: 'VentureBeat' },
  ],
  tecnologia: [
    { url: 'https://techcrunch.com/feed/',                         name: 'TechCrunch' },
    { url: 'https://www.theverge.com/rss/index.xml',               name: 'The Verge' },
    { url: 'http://feeds.bbci.co.uk/news/technology/rss.xml',      name: 'BBC Tech' },
    { url: 'https://feeds.arstechnica.com/arstechnica/index',      name: 'Ars Technica' },
    { url: 'https://www.wired.com/feed/rss',                       name: 'Wired' },
    { url: 'https://www.theguardian.com/technology/rss',           name: 'Guardian Tech' },
  ],
  saude: [
    { url: 'http://feeds.bbci.co.uk/news/health/rss.xml',          name: 'BBC Health' },
    { url: 'https://www.theguardian.com/society/health/rss',       name: 'The Guardian' },
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Health.xml', name: 'NY Times Health' },
    { url: 'https://feeds.npr.org/1128/rss.xml',                   name: 'NPR Health' },
    { url: 'https://www.who.int/rss-feeds/news-english.xml',       name: 'WHO' },
  ],
  clima: [
    { url: 'http://feeds.bbci.co.uk/news/science_and_environment/rss.xml', name: 'BBC Science' },
    { url: 'https://www.theguardian.com/environment/climate-crisis/rss',   name: 'Guardian Climate' },
    { url: 'https://www.theguardian.com/environment/rss',          name: 'Guardian Environment' },
    { url: 'https://feeds.npr.org/1025/rss.xml',                   name: 'NPR Environment' },
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Climate.xml', name: 'NY Times Climate' },
  ],
  ciencia: [
    { url: 'http://feeds.bbci.co.uk/news/science_and_environment/rss.xml', name: 'BBC Science' },
    { url: 'https://www.theguardian.com/science/rss',              name: 'Guardian Science' },
    { url: 'https://feeds.arstechnica.com/arstechnica/science',    name: 'Ars Technica Science' },
    { url: 'https://spacenews.com/feed/',                          name: 'SpaceNews' },
    { url: 'https://www.sciencedaily.com/rss/all.xml',             name: 'Science Daily' },
    { url: 'https://www.nasa.gov/news-release/feed/',              name: 'NASA' },
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Science.xml', name: 'NY Times Science' },
  ],
  esportes: [
    { url: 'http://feeds.bbci.co.uk/sport/rss.xml',                name: 'BBC Sport' },
    { url: 'https://www.theguardian.com/sport/rss',                name: 'Guardian Sport' },
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Sports.xml', name: 'NY Times Sports' },
    { url: 'https://www.espn.com/espn/rss/news',                   name: 'ESPN' },
    { url: 'https://feeds.skysports.com/SkySports-MoreSports.xml', name: 'Sky Sports' },
  ],
  entretenimento: [
    { url: 'http://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml', name: 'BBC Entertainment' },
    { url: 'https://variety.com/feed/',                            name: 'Variety' },
    { url: 'https://www.hollywoodreporter.com/feed/',              name: 'Hollywood Reporter' },
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Arts.xml', name: 'NY Times Arts' },
    { url: 'https://pitchfork.com/feed/feed-news/rss/',            name: 'Pitchfork' },
  ],
  crime: [
    { url: 'http://feeds.bbci.co.uk/news/world/rss.xml',           name: 'BBC World' },
    { url: 'https://www.theguardian.com/world/rss',                name: 'The Guardian' },
    { url: 'https://www.aljazeera.com/xml/rss/all.xml',            name: 'Al Jazeera' },
    { url: 'https://feeds.npr.org/1003/rss.xml',                   name: 'NPR News' },
  ],
};

// Feeds regionais específicos por país
const REGION_FEEDS = {
  br: [
    { url: 'https://g1.globo.com/rss/g1/',                              name: 'G1 Globo' },
    { url: 'https://feeds.folha.uol.com.br/emcimadahora/rss091.xml',   name: 'Folha de S.Paulo' },
    { url: 'https://www.uol.com.br/rss/noticias/',                     name: 'UOL' },
  ],
  gb: [
    { url: 'https://www.theguardian.com/uk/rss',                       name: 'The Guardian UK' },
    { url: 'http://feeds.bbci.co.uk/news/uk/rss.xml',                  name: 'BBC UK' },
  ],
  us: [
    { url: 'https://feeds.npr.org/1001/rss.xml',                       name: 'NPR' },
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml', name: 'NY Times' },
  ],
  au: [
    { url: 'http://feeds.bbci.co.uk/news/world/australia/rss.xml',     name: 'BBC Australia' },
  ],
  me: [
    { url: 'https://www.aljazeera.com/xml/rss/all.xml',                name: 'Al Jazeera' },
    { url: 'https://www.middleeasteye.net/rss',                        name: 'Middle East Eye' },
  ],
  af: [
    { url: 'https://www.aljazeera.com/xml/rss/all.xml',                name: 'Al Jazeera' },
    { url: 'http://feeds.bbci.co.uk/news/world/africa/rss.xml',        name: 'BBC Africa' },
  ],
  cn: [
    { url: 'http://feeds.bbci.co.uk/news/world/asia/rss.xml',          name: 'BBC Asia' },
  ],
  jp: [
    { url: 'http://feeds.bbci.co.uk/news/world/asia/rss.xml',          name: 'BBC Asia' },
  ],
  kr: [
    { url: 'http://feeds.bbci.co.uk/news/world/asia/rss.xml',          name: 'BBC Asia' },
  ],
  eu: [
    { url: 'http://feeds.bbci.co.uk/news/world/europe/rss.xml',        name: 'BBC Europe' },
    { url: 'https://www.theguardian.com/world/europe-news/rss',        name: 'Guardian Europe' },
  ],
  de: [
    { url: 'http://feeds.bbci.co.uk/news/world/europe/rss.xml',        name: 'BBC Europe' },
  ],
  fr: [
    { url: 'http://feeds.bbci.co.uk/news/world/europe/rss.xml',        name: 'BBC Europe' },
  ],
  sa: [
    { url: 'http://feeds.bbci.co.uk/news/world/latin_america/rss.xml', name: 'BBC América Latina' },
  ],
  am: [
    { url: 'http://feeds.bbci.co.uk/news/world/latin_america/rss.xml', name: 'BBC América Latina' },
  ],
  ar: [
    { url: 'http://feeds.bbci.co.uk/news/world/latin_america/rss.xml', name: 'BBC América Latina' },
  ],
  cl: [
    { url: 'http://feeds.bbci.co.uk/news/world/latin_america/rss.xml', name: 'BBC América Latina' },
  ],
  mx: [
    { url: 'http://feeds.bbci.co.uk/news/world/latin_america/rss.xml', name: 'BBC América Latina' },
  ],
};

// Palavras-chave por assunto (para filtrar feeds diretos no cliente)
const SUBJECT_KEYWORDS = {
  politica:       ['politi','govern','election','president','minister','parliament','senator','congress','democra','republic','vote','partido','eleição','governo','presidente'],
  economia:       ['econom','gdp','gdp','inflation','recession','trade','employment','unemploy','inflação','recessão','crescimento','fiscal','pib'],
  financas:       ['market','stock','nasdaq','dow jones','s&p','invest','bank','fund','crypto','bitcoin','bolsa','ação','mercado','finanças','hedge'],
  ia:             ['artificial intelligence','machine learning','chatgpt','openai','llm','gpt','neural','deep learning','inteligência artificial','gemini','claude','anthropic','copilot','ai model','ai '],
  tecnologia:     ['tech','software','startup','digital','cyber','silicon','smartphone','apple','google','microsoft','amazon','meta','hardware','cloud','chip'],
  saude:          ['health','medical','hospital','doctor','patient','disease','drug','vaccine','cancer','mental health','clinical','saúde','médico','doença','tratamento','pandemia'],
  clima:          ['climate','environment','carbon','emission','warming','renewable','fossil','storm','flood','drought','sustainability','green energy','clima','ambiente','aquecimento'],
  ciencia:        ['science','research','study','space','nasa','planet','star','universe','experiment','discovery','physics','biology','ciência','pesquisa','espaço','descoberta'],
  esportes:       ['sport','football','soccer','basketball','tennis','olympic','champion','league','player','match','tournament','esporte','futebol','campeonato','jogador','copa'],
  entretenimento: ['entertainment','film','movie','music','celebrity','award','netflix','oscar','grammy','actor','singer','streaming','filme','música','serie','entretenimento'],
  crime:          ['crime','police','arrest','murder','court','trial','justice','prison','suspect','investigation','terror','shooting','crime','policia','tribunal','preso'],
};

/* ── RSS FETCH ───────────────────────────────────────────── */

async function proxyFetch(url) {
  for (const makeProxy of PROXIES) {
    try {
      const res = await fetch(makeProxy(url), { signal: AbortSignal.timeout(9000) });
      if (!res.ok) continue;
      const ct = res.headers.get('content-type') || '';
      if (ct.includes('json')) {
        const j = await res.json();
        return j.contents || j.body || '';
      }
      return await res.text();
    } catch {
      /* tenta próximo proxy */
    }
  }
  return null; // falhou — não lançar para não abortar toda a busca
}

function parseRSS(xml, opts = {}) {
  const { regionId = null, subjectId = null, sourceName = null, isGoogleNews = false } = opts;
  try {
    const doc   = new DOMParser().parseFromString(xml, 'text/xml');
    const items = [...doc.querySelectorAll('item')];
    return items.map(item => {
      const rawTitle  = item.querySelector('title')?.textContent?.trim()  || '';
      const link      = item.querySelector('link')?.textContent?.trim()   || '#';
      const pubDate   = item.querySelector('pubDate')?.textContent?.trim() || '';
      const srcEl     = item.querySelector('source');
      const srcName   = srcEl?.textContent?.trim() || sourceName || '';

      let title  = rawTitle;
      let source = srcName;

      if (isGoogleNews) {
        // Google News: "Article Title - Source Name"
        const sep = rawTitle.lastIndexOf(' - ');
        if (sep > 0) { title = rawTitle.slice(0, sep).trim(); source = rawTitle.slice(sep + 3).trim(); }
      }

      // Strip HTML from description
      const rawDesc  = item.querySelector('description')?.textContent || '';
      const descDoc  = new DOMParser().parseFromString(rawDesc, 'text/html');
      const description = (descDoc.body.textContent || '').trim().slice(0, 300);

      let parsedDate;
      try { parsedDate = pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(); }
      catch { parsedDate = new Date().toISOString(); }

      return {
        title,
        description,
        url: link,
        image: null,
        publishedAt: parsedDate,
        source: { name: source || 'Notícia' },
        _regionId:  regionId,
        _subjectId: subjectId,
      };
    }).filter(a => a.title && a.title.length > 5);
  } catch {
    return [];
  }
}

// ─ Google News RSS ─
function buildGoogleNewsURL(subjectQuery, region, afterDate, forceEnglish = false) {
  const locale = forceEnglish
    ? { hl: 'en-US', gl: 'US', ceid: 'US:en' }
    : (REGION_LOCALE[region?.id] || { hl: 'pt-BR', gl: 'BR', ceid: 'BR:pt-BR' });
  const parts = [];
  if (subjectQuery) parts.push(subjectQuery);
  if (region?.extraQ) parts.push(`(${region.extraQ})`);
  if (afterDate)    parts.push(`after:${afterDate}`);
  const q = parts.join(' ') || 'world news';
  return `https://news.google.com/rss/search?${new URLSearchParams({ q, ...locale })}`;
}

async function fetchGoogleNews(subjectQuery, region, afterDate, forceEnglish = false) {
  const url = buildGoogleNewsURL(subjectQuery, region, afterDate, forceEnglish);
  const xml = await proxyFetch(url);
  if (!xml) return [];
  return parseRSS(xml, {
    regionId: region?.id || null,
    subjectId: null,
    isGoogleNews: true,
  });
}

// ─ Direct feed ─
async function fetchDirectFeed(feedInfo, subjectId) {
  const xml = await proxyFetch(feedInfo.url);
  if (!xml) return [];
  return parseRSS(xml, {
    regionId: null,
    subjectId,
    sourceName: feedInfo.name,
    isGoogleNews: false,
  });
}

// ─ Keyword match ─
function articleMatchesSubjects(article, subjectIds) {
  if (!subjectIds || subjectIds.length === 0) return true;
  const haystack = `${article.title} ${article.description}`.toLowerCase();
  return subjectIds.some(id => {
    const kws = SUBJECT_KEYWORDS[id] || [];
    return kws.some(kw => haystack.includes(kw.toLowerCase()));
  });
}

// ─ Main fetch ─
async function fetchNews() {
  const selectedRegions  = state.regions.size  > 0 ? [...state.regions].map(getRegion)  : [];
  const selectedSubjects = state.subjects.size > 0 ? [...state.subjects].map(getSubject) : [];
  const period   = getPeriod(state.period);
  const after    = isoFromDaysAgo(period.days);
  const subjectIds = selectedSubjects.map(s => s?.id).filter(Boolean);

  const subjectQuery = selectedSubjects.filter(Boolean).map(s => `(${s.q})`).join(' OR ') || '';

  const calls = [];

  // ① Google News por região (locale nativo + fallback inglês)
  const gNewsRegions = selectedRegions.length > 0 ? selectedRegions : [null];
  for (const region of gNewsRegions.slice(0, 4)) {
    calls.push(fetchGoogleNews(subjectQuery, region, after, false));
    // Se locale não for inglês, tenta em inglês também
    const loc = REGION_LOCALE[region?.id]?.hl || '';
    if (!loc.startsWith('en')) {
      calls.push(fetchGoogleNews(subjectQuery, region, after, true));
    }
  }

  // ② Feeds diretos por assunto
  const usedDirectUrls = new Set();
  const directSubjects = subjectIds.length > 0 ? subjectIds : Object.keys(DIRECT_FEEDS);
  for (const sid of directSubjects.slice(0, 4)) {
    const feeds = DIRECT_FEEDS[sid] || [];
    for (const feed of feeds.slice(0, 2)) {
      if (!usedDirectUrls.has(feed.url)) {
        usedDirectUrls.add(feed.url);
        calls.push(fetchDirectFeed(feed, sid));
      }
    }
  }

  // ③ Feeds diretos por região
  for (const region of selectedRegions.slice(0, 3)) {
    const feeds = REGION_FEEDS[region?.id] || [];
    for (const feed of feeds.slice(0, 2)) {
      if (!usedDirectUrls.has(feed.url)) {
        usedDirectUrls.add(feed.url);
        calls.push(fetchDirectFeed(feed, null));
      }
    }
  }

  const results = await Promise.allSettled(calls);

  // ─ Merge, dedup, filtra ─
  const seen     = new Set();
  const articles = [];
  const cutoff   = Date.now() - period.days * 86400000;
  let   imgCounter = 0;

  for (const r of results) {
    if (r.status !== 'fulfilled') continue;
    for (const a of r.value) {
      if (!a.title || seen.has(a.url) || a.url === '#') continue;

      // Filtro de data
      if (new Date(a.publishedAt) < cutoff) continue;

      // Para feeds diretos (não Google News), filtra por palavras-chave de assunto
      if (!a._regionId && subjectIds.length > 0 && !a._subjectId) {
        if (!articleMatchesSubjects(a, subjectIds)) continue;
      }

      // Filtra por região via keywords para feeds globais (quando região selecionada)
      // Google News já filtra por locale; feeds diretos são globais — sem filtro regional extra

      seen.add(a.url);

      // Infere assunto pelo keyword matching se não atribuído
      if (!a._subjectId && subjectIds.length === 1) {
        a._subjectId = subjectIds[0];
      } else if (!a._subjectId && subjectIds.length > 1) {
        a._subjectId = subjectIds.find(id => articleMatchesSubjects(a, [id])) || subjectIds[0];
      }

      // Infere região se não atribuída e só uma selecionada
      if (!a._regionId && selectedRegions.length === 1) {
        a._regionId = selectedRegions[0]?.id || null;
      }

      a.image = subjectImage(a._subjectId, imgCounter++);
      articles.push(a);
    }
  }

  return articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
}

function filterDemoArticles() {
  let list = [...DEMO_ARTICLES];
  if (state.regions.size  > 0) list = list.filter(a => state.regions.has(a._regionId));
  if (state.subjects.size > 0) list = list.filter(a => state.subjects.has(a._subjectId));
  const period = getPeriod(state.period);
  const cutoff = Date.now() - period.days * 86400000;
  return list
    .filter(a => new Date(a.publishedAt) >= cutoff)
    .map((a, i) => ({ ...a, image: subjectImage(a._subjectId, i) }));
}

/* ── RENDER ──────────────────────────────────────────────── */
function renderCard(article) {
  const region  = getRegion(article._regionId);
  const subject = getSubject(article._subjectId);

  const card = document.createElement('article');
  card.className = 'card';
  card.setAttribute('role', 'listitem');

  card.innerHTML = `
    <div class="card-image-wrap">
      <img
        class="card-image"
        src="${escHtml(article.image || subjectImage(article._subjectId))}"
        alt=""
        loading="lazy"
        onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
      />
      <div class="card-image-placeholder" style="display:none">
        <span>${subject?.icon || '📰'}</span>
        <span>${escHtml(subject?.label || 'Notícia')}</span>
      </div>
      <div class="card-source-badge">
        <span class="source-dot"></span>
        ${escHtml(article.source?.name || 'Notícia')}
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
  const frag = document.createDocumentFragment();
  for (let i = 0; i < n; i++) {
    const el = document.createElement('div');
    el.className = 'skeleton-card';
    el.innerHTML = `
      <div class="skel skel-image"></div>
      <div class="skel-body">
        <div class="skel-badges"><div class="skel skel-badge"></div><div class="skel skel-badge"></div></div>
        <div class="skel skel-title"></div><div class="skel skel-title-2"></div>
        <div class="skel skel-desc"></div><div class="skel skel-desc-2"></div><div class="skel skel-desc-3"></div>
      </div>
      <div class="skel skel-footer"></div>`;
    frag.appendChild(el);
  }
  return frag;
}

/* ── SIDEBAR BUILDING ────────────────────────────────────── */
function buildSidebar() {
  buildRegionFilters();
  buildPeriodFilters();
  buildSubjectFilters();
}

function buildRegionFilters() {
  const body   = document.getElementById('regionBody');
  const groups = {};
  for (const r of REGIONS) (groups[r.group] = groups[r.group] || []).push(r);
  for (const [group, items] of Object.entries(groups)) {
    const lbl = document.createElement('div');
    lbl.className = 'filter-group-label';
    lbl.textContent = group;
    body.appendChild(lbl);
    items.forEach(r => body.appendChild(createCheckItem('region', r.id, `${r.icon} ${r.label}`)));
    const div = document.createElement('div');
    div.className = 'divider';
    body.appendChild(div);
  }
}

function buildPeriodFilters() {
  const body = document.getElementById('periodBody');
  PERIODS.forEach(p => body.appendChild(createRadioItem('period', p.id, p.label, p.id === state.period)));
}

function buildSubjectFilters() {
  const body = document.getElementById('subjectBody');
  SUBJECTS.forEach(s => body.appendChild(createCheckItem('subject', s.id, `${s.icon} ${s.label}`)));
}

function createCheckItem(type, id, label) {
  const el = document.createElement('label');
  el.className = 'filter-item';
  el.innerHTML = `
    <input type="checkbox" data-type="${type}" data-id="${escHtml(id)}" />
    <span class="filter-item-label">${label}</span>`;
  return el;
}

function createRadioItem(type, id, label, checked) {
  const el = document.createElement('label');
  el.className = 'filter-item';
  el.innerHTML = `
    <input type="radio" name="${type}" data-type="${type}" data-id="${escHtml(id)}" ${checked ? 'checked' : ''} />
    <span class="filter-item-label">${label}</span>`;
  return el;
}

/* ── FILTER TAGS ─────────────────────────────────────────── */
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
    tag.innerHTML = `${escHtml(item.label)}<span class="filter-tag-remove" data-type="${item.type}" data-id="${escHtml(item.id)}" title="Remover">✕</span>`;
    tags.appendChild(tag);
  }
  bar.hidden = false;
}

/* ── RESULTS META ────────────────────────────────────────── */
function updateResultsMeta(count, demo) {
  const meta = document.getElementById('resultsMeta');
  document.getElementById('resultsCount').innerHTML =
    `<strong>${count}</strong> notícia${count !== 1 ? 's' : ''} encontrada${count !== 1 ? 's' : ''}`;
  document.getElementById('resultsRange').textContent = demo ? '(modo demonstração)' : '(Google News RSS)';
  meta.hidden = false;
}

/* ── SEARCH FLOW ─────────────────────────────────────────── */
async function performSearch(demo = false) {
  setLoading(true);
  updateFilterTags();

  try {
    const articles = demo ? filterDemoArticles() : await fetchNews();
    if (articles.length === 0 && !demo) {
      // Try demo as fallback
      const demoList = filterDemoArticles();
      if (demoList.length > 0) {
        renderResults(demoList, true);
        showToast('Dados ao vivo indisponíveis — exibindo demonstração.', 'warning');
      } else {
        renderResults([], false);
      }
    } else {
      renderResults(articles, demo);
    }
  } catch (err) {
    showErrorState(err.message || 'Erro ao buscar notícias.');
  } finally {
    setLoading(false);
  }
}

function renderResults(articles, demo) {
  const grid      = document.getElementById('cardsGrid');
  const container = document.getElementById('stateContainer');
  grid.innerHTML  = '';

  if (articles.length === 0) {
    container.classList.remove('hidden');
    setState('empty');
    updateResultsMeta(0, demo);
    return;
  }

  container.classList.add('hidden');
  updateResultsMeta(articles.length, demo);

  const frag = document.createDocumentFragment();
  articles.forEach(a => frag.appendChild(renderCard(a)));
  grid.appendChild(frag);
}

function setLoading(on) {
  state.loading = on;
  const grid      = document.getElementById('cardsGrid');
  const container = document.getElementById('stateContainer');
  const btn       = document.getElementById('searchBtn');
  const demoBtn   = document.getElementById('demoBtn');

  if (on) {
    grid.innerHTML = '';
    document.getElementById('resultsMeta').hidden = true;
    container.classList.remove('hidden');
    setState('loading');
    const skelGrid = document.getElementById('skeletonGrid');
    skelGrid.innerHTML = '';
    skelGrid.appendChild(renderSkeletons(6));
    btn.disabled     = true;
    btn.textContent  = 'Buscando…';
    if (demoBtn) demoBtn.disabled = true;
  } else {
    container.classList.add('hidden');
    btn.disabled    = false;
    btn.innerHTML   = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> Buscar Notícias`;
    if (demoBtn) demoBtn.disabled = false;
  }
}

function setState(which) {
  ['initialState','loadingState','emptyState','errorState'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.hidden = true;
  });
  const target = document.getElementById(which + 'State');
  if (target) target.hidden = false;
}

function showErrorState(msg) {
  document.getElementById('cardsGrid').innerHTML = '';
  document.getElementById('stateContainer').classList.remove('hidden');
  setState('error');
  document.getElementById('errorMessage').textContent = msg;
  setLoading(false);
}

/* ── TOAST ───────────────────────────────────────────────── */
let _toastTimer;
function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className   = `toast ${type}`;
  t.classList.remove('hidden');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => t.classList.add('hidden'), 4000);
}

/* ── SIDEBAR (mobile) ────────────────────────────────────── */
function openSidebar()  {
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
    const { type, id } = e.target.dataset;
    if (!type || !id) return;
    if (type === 'region') {
      e.target.checked ? state.regions.add(id) : state.regions.delete(id);
    } else if (type === 'subject') {
      e.target.checked ? state.subjects.add(id) : state.subjects.delete(id);
    } else if (type === 'period') {
      state.period = id;
    }
  });

  // Collapsible sections
  document.querySelectorAll('.filter-section-header').forEach(h => {
    h.addEventListener('click', () => h.closest('.filter-section').classList.toggle('collapsed'));
    h.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') h.click(); });
  });

  // Search
  document.getElementById('searchBtn').addEventListener('click', () => performSearch(false));

  // Demo button
  document.getElementById('demoBtn')?.addEventListener('click', () => {
    performSearch(true);
    showToast('Exibindo dados de demonstração.', 'success');
  });

  // Demo link (initial state)
  document.getElementById('demoLinkBtn')?.addEventListener('click', e => {
    e.preventDefault();
    performSearch(true);
  });

  // Clear filters
  document.getElementById('clearBtn').addEventListener('click', () => {
    state.regions.clear();
    state.subjects.clear();
    state.period = 'week';
    document.querySelectorAll('[data-type="region"],[data-type="subject"]').forEach(i => (i.checked = false));
    document.querySelectorAll('[data-type="period"]').forEach(i => (i.checked = i.dataset.id === 'week'));
    document.getElementById('filtersBar').hidden = true;
    document.getElementById('resultsMeta').hidden = true;
    document.getElementById('cardsGrid').innerHTML = '';
    document.getElementById('stateContainer').classList.remove('hidden');
    setState('initial');
    showToast('Filtros limpos.');
  });

  // Remove individual filter tag
  document.getElementById('filterTags').addEventListener('click', e => {
    const btn = e.target.closest('.filter-tag-remove');
    if (!btn) return;
    const { type, id } = btn.dataset;
    if (type === 'region')  { state.regions.delete(id);  setCheckbox('region',  id, false); }
    if (type === 'subject') { state.subjects.delete(id); setCheckbox('subject', id, false); }
    updateFilterTags();
  });

  // Clear all tags
  document.getElementById('clearAllTagsBtn')?.addEventListener('click', () => {
    document.getElementById('clearBtn').click();
  });

  // Error state actions
  document.getElementById('retryBtn')?.addEventListener('click',  () => performSearch(false));
  document.getElementById('retryBtn2')?.addEventListener('click', () => performSearch(false));
  document.getElementById('demoFallbackBtn')?.addEventListener('click', () => performSearch(true));

  // Mobile sidebar
  document.getElementById('filterToggle').addEventListener('click', openSidebar);
  document.getElementById('sidebarClose').addEventListener('click', closeSidebar);
  document.getElementById('sidebarOverlay').addEventListener('click', closeSidebar);

  // Keyboard
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSidebar(); });
}

function setCheckbox(type, id, checked) {
  const el = document.querySelector(`[data-type="${type}"][data-id="${id}"]`);
  if (el) el.checked = checked;
}

/* ── INIT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  buildSidebar();
  attachEvents();
});
