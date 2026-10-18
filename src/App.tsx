import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight,
 CheckCircle2, ChevronDown, CircleUserRound,
  ExternalLink, Eye, FilePenLine, Filter, LockKeyhole,
  LogOut, Menu, Newspaper, Plus, Search, ShieldCheck,
  Sparkles, Trash2, Trophy, Volleyball, X
} from 'lucide-react'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import './App.css'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined

const supabase: SupabaseClient | null =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null

const TEAMS = [
  'All Teams',
  'Creamline Cool Smashers',
  'Choco Mucho Flying Titans',
  'Criss Cross King Crunchers',
] as const

const TEAM_SHORT: Record<string, string> = {
  'Creamline Cool Smashers': 'CREAMLINE',
  'Choco Mucho Flying Titans': 'CHOCO MUCHO',
  'Criss Cross King Crunchers': 'CRISS CROSS',
}

type Article = {
  id: string
  title: string
  slug: string
  team: string
  category: string
  excerpt: string
  body: string
  image_url: string | null
  source_url: string | null
  status: 'draft' | 'published'
  author_id: string | null
  published_at: string | null
  created_at: string
  updated_at: string
}

type ArticleForm = {
  title: string
  slug: string
  team: string
  category: string
  excerpt: string
  body: string
  image_url: string
  source_url: string
  status: 'draft' | 'published'
}

type ContentSection = 'home' | 'teams' | 'players' | 'standings' | 'schedule' | 'recaps' | 'live' | 'videos' | 'photos' | 'stats' | 'tickets'
type SectionContent = {
  id: string
  section: ContentSection
  title: string
  slug: string
  summary: string
  body: string
  image_url: string | null
  external_url: string | null
  metadata: Record<string, unknown>
  status: 'draft' | 'published'
  featured: boolean
  sort_order: number
  published_at: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}
type SectionContentForm = {
  section: ContentSection
  title: string
  slug: string
  summary: string
  body: string
  image_url: string
  external_url: string
  metadata: string
  status: 'draft' | 'published'
  featured: boolean
  sort_order: string
}

const CONTENT_SECTIONS: { value: ContentSection; label: string; path: string }[] = [
  { value: 'home', label: 'Home highlights', path: '/' },
  { value: 'teams', label: 'Teams', path: '/teams' },
  { value: 'players', label: 'Players', path: '/players' },
  { value: 'standings', label: 'Standings', path: '/standings' },
  { value: 'schedule', label: 'Schedule', path: '/schedule' },
  { value: 'recaps', label: 'Recaps', path: '/recaps' },
  { value: 'live', label: 'Live', path: '/live' },
  { value: 'videos', label: 'Videos', path: '/videos' },
  { value: 'photos', label: 'Photos', path: '/photos' },
  { value: 'stats', label: 'Stats', path: '/stats' },
  { value: 'tickets', label: 'Tickets', path: '/tickets' },
]

const EMPTY_SECTION_FORM: SectionContentForm = {
  section: 'home', title: '', slug: '', summary: '', body: '', image_url: '',
  external_url: '', metadata: '{}', status: 'draft', featured: false, sort_order: '0',
}

const EMPTY_FORM: ArticleForm = {
  title: '',
  slug: '',
  team: TEAMS[1],
  category: 'News',
  excerpt: '',
  body: '',
  image_url: '',
  source_url: '',
  status: 'draft',
}

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function formatDate(value: string | null) {
  if (!value) return 'Unpublished'
  return new Intl.DateTimeFormat('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

function isValidHttpUrl(value: string) {
  if (!value.trim()) return true
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

function TeamMark({ team }: { team: string }) {
  return (
    <span className={`team-mark ${team === TEAMS[1] ? 'mark-creamline' : team === TEAMS[2] ? 'mark-choco' : 'mark-criss'}`}>
      <Volleyball size={19} aria-hidden="true" />
    </span>
  )
}

function Header({ admin = false }: { admin?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <div className="top-strip">
        <div className="site-container top-strip-inner">
          <span><span className="live-dot" /> YOUR VOLLEYBALL. YOUR COMMUNITY.</span>
          <span className="top-strip-right">INDEPENDENT FAN PUBLICATION <ArrowUpRight size={13} /></span>
        </div>
      </div>
      <header className="site-header">
        <div className="site-container header-inner">
          <a href="/" className="brand" aria-label="REBISCOmmunity home">
            <span className="brand-icon"><Volleyball size={25} /></span>
            <span className="brand-wordmark">
              REBISCO<span>mmunity</span>
              <small>THE VOLLEYBALL FAN DESK</small>
            </span>
          </a>
          <button
            className="icon-button mobile-menu-button"
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
          <nav className={`main-nav ${menuOpen ? 'nav-open' : ''}`} aria-label="Main navigation">
            <a href="/news" onClick={() => setMenuOpen(false)}>LATEST NEWS</a>
            <a href="/teams" onClick={() => setMenuOpen(false)}>TEAMS</a>
            <a href="/players" onClick={() => setMenuOpen(false)}>PLAYERS</a>
            <a href="/standings" onClick={() => setMenuOpen(false)}>STANDINGS</a>
            <a href="/schedule" onClick={() => setMenuOpen(false)}>SCHEDULE</a>
            <a href="/recaps" onClick={() => setMenuOpen(false)}>RECAPS</a>
            <a href="/live" onClick={() => setMenuOpen(false)}>LIVE</a>
            <a href="/videos" onClick={() => setMenuOpen(false)}>VIDEOS</a>
            <a href="/photos" onClick={() => setMenuOpen(false)}>PHOTOS</a>
            <a href="/stats" onClick={() => setMenuOpen(false)}>STATS</a>
            <a href="/tickets" onClick={() => setMenuOpen(false)}>TICKETS</a>
            <a className="nav-admin" href="/admin">
              <LockKeyhole size={15} /> {admin ? 'DASHBOARD' : 'EDITOR LOGIN'}
            </a>
          </nav>
        </div>
      </header>
    </>
  )
}

function Footer() {
  return (
    <footer className="site-footer" id="about">
      <div className="site-container footer-main">
        <div>
          <a href="/" className="brand footer-brand">
            <span className="brand-icon"><Volleyball size={25} /></span>
            <span className="brand-wordmark">REBISCO<span>mmunity</span><small>THE VOLLEYBALL FAN DESK</small></span>
          </a>
          <p>For the fans who live every rally.</p>
        </div>
        <div className="footer-disclaimer">
          <strong>AN INDEPENDENT FAN PUBLICATION</strong>
          <p>REBISCOmmunity is an independent fan project, not an official team or sponsor website. Team names and marks belong to their respective owners. Updates should be verified against linked sources.</p>
        </div>
      </div>
      <div className="site-container footer-bottom">
        <span>© {new Date().getFullYear()} REBISCOmmunity</span>
        <span>BUILT FOR THE LOVE OF THE GAME <Volleyball size={14} /></span>
      </div>
    </footer>
  )
}

function ArticleCard({
  article,
  featured = false,
  onOpen,
}: {
  article: Article
  featured?: boolean
  onOpen: (article: Article) => void
}) {
  return (
    <article className={`article-card ${featured ? 'article-card-featured' : ''}`}>
      <button
        className="article-image-button"
        onClick={() => onOpen(article)}
        aria-label={`Read ${article.title}`}
      >
        {article.image_url ? (
          <img className="article-image" src={article.image_url} alt="" loading="lazy" />
        ) : (
          <div className={`article-image-placeholder ${article.team === TEAMS[1] ? 'placeholder-creamline' : article.team === TEAMS[2] ? 'placeholder-choco' : 'placeholder-criss'}`}>
            <span className="placeholder-kicker">{TEAM_SHORT[article.team]}</span>
            <Volleyball className="placeholder-ball" size={featured ? 94 : 66} strokeWidth={1.1} aria-hidden="true" />
            <span className="placeholder-bottom">REBISCO<span>mmunity</span></span>
          </div>
        )}
        <span className="image-category">{article.category}</span>
      </button>
      <div className="article-card-copy">
        <div className="article-meta">
          <span className="team-label"><TeamMark team={article.team} />{TEAM_SHORT[article.team]}</span>
          <span className="meta-dot" />
          <span>{formatDate(article.published_at)}</span>
        </div>
        <button className="article-title-button" onClick={() => onOpen(article)}>
          <h3>{article.title}</h3>
        </button>
        <p className="article-excerpt">{article.excerpt}</p>
        <button className="read-link" onClick={() => onOpen(article)}>
          READ STORY <ArrowUpRight size={16} />
        </button>
      </div>
    </article>
  )
}

function ArticleReader({
  article,
  onClose,
}: {
  article: Article
  onClose: () => void
}) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div className="reader-overlay" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section className="reader-panel" role="dialog" aria-modal="true" aria-labelledby="reader-title">
        <div className="reader-toolbar">
          <span><Newspaper size={17} /> STORY DESK</span>
          <button className="icon-button" onClick={onClose} aria-label="Close article"><X /></button>
        </div>
        {article.image_url && <img src={article.image_url} alt="" className="reader-image" />}
        <div className="reader-content">
          <div className="article-meta">
            <span className="team-label"><TeamMark team={article.team} />{TEAM_SHORT[article.team]}</span>
            <span className="meta-dot" />
            <span>{formatDate(article.published_at)}</span>
          </div>
          <span className="eyebrow">{article.category}</span>
          <h2 id="reader-title">{article.title}</h2>
          <p className="reader-excerpt">{article.excerpt}</p>
          <div className="reader-body">{article.body}</div>
          {article.source_url && (
            <a className="button button-outline source-button" href={article.source_url} target="_blank" rel="noopener noreferrer">
              VIEW ORIGINAL SOURCE <ExternalLink size={16} />
            </a>
          )}
          <p className="reader-disclaimer">Independent fan coverage. Please consult the linked original source for official announcements and updates.</p>
        </div>
      </section>
    </div>
  )
}

function PublicHome() {
  const [articles, setArticles] = useState<Article[]>([])
  const [homeHighlights, setHomeHighlights] = useState<SectionContent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [team, setTeam] = useState<string>('All Teams')
  const [category, setCategory] = useState('All Stories')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Article | null>(null)

  useEffect(() => {
    let active = true
    async function loadArticles() {
      if (!supabase) {
        setError('Connect Supabase to publish real articles. The editorial feed is not configured yet.')
        setLoading(false)
        return
      }
      const now = new Date().toISOString()
      const [{ data, error: queryError }, { data: highlightData, error: highlightError }] = await Promise.all([
        supabase
          .from('articles')
          .select('*')
          .eq('status', 'published')
          .not('published_at', 'is', null)
          .lte('published_at', now)
          .order('published_at', { ascending: false })
          .limit(100),
        supabase
          .from('section_content')
          .select('*')
          .eq('section', 'home')
          .eq('status', 'published')
          .not('published_at', 'is', null)
          .lte('published_at', now)
          .order('featured', { ascending: false })
          .order('sort_order', { ascending: true })
          .order('published_at', { ascending: false })
          .limit(8),
      ])

      if (!active) return
      if (queryError) setError('We could not load updates. Check your Supabase setup and database policies.')
      else setArticles((data ?? []) as Article[])
      if (highlightError) console.error('Home highlights could not be loaded:', highlightError.message)
      else setHomeHighlights((highlightData ?? []) as SectionContent[])
      setLoading(false)
    }
    void loadArticles()
    return () => { active = false }
  }, [])

  const filtered = useMemo(() => articles.filter((article) => {
    const matchesTeam = team === 'All Teams' || article.team === team
    const matchesCategory = category === 'All Stories' || article.category === category
    const term = search.trim().toLowerCase()
    const matchesSearch = !term || [article.title, article.excerpt, article.body, article.team]
      .some((value) => value.toLowerCase().includes(term))
    return matchesTeam && matchesCategory && matchesSearch
  }), [articles, team, category, search])

  const featured = filtered[0]
  const remaining = filtered.slice(1)
  const openArticle = (article: Article) => setSelected(article)

  return (
    <>
      <Header />
      <main>
        <section className="hero">
          <div className="hero-grid" aria-hidden="true" />
          <div className="site-container hero-layout">
            <div className="hero-copy">
              <div className="hero-kicker"><span className="live-dot" /> THE FAN DESK IS OPEN</div>
              <h1>EVERY RALLY.<br />EVERY <span>STORY.</span></h1>
              <p className="hero-description">Your home for the latest from the teams, players, and moments that make Philippine volleyball unforgettable.</p>
              <a className="button button-primary" href="#latest">EXPLORE THE LATEST <ArrowDownRight size={18} /></a>
              <div className="hero-footnote"><ShieldCheck size={15} /> FAN-DRIVEN. SOURCE-LED. VOLLEYBALL-OBSESSED.</div>
            </div>
            <div className="hero-art" aria-label="Volleyball illustration">
              <div className="hero-orbit orbit-one" />
              <div className="hero-orbit orbit-two" />
              <div className="hero-number">01</div>
              <div className="hero-ball"><Volleyball size={174} strokeWidth={0.9} /></div>
              <div className="hero-stamp"><span>THE</span><strong>GAME</strong><span>NEVER STOPS</span></div>
              <div className="hero-side-note">PHILIPPINE VOLLEYBALL / FAN CULTURE / 01</div>
            </div>
          </div>
          <div className="hero-bottom-line">
            <div className="site-container hero-bottom-inner">
              <span>ONE COMMUNITY. THREE TEAMS.</span>
              <span>MADE FOR THE LOVE OF VOLLEYBALL <ArrowRight size={15} /></span>
            </div>
          </div>
        </section>

        <section className="team-ribbon" id="teams" aria-label="Featured teams">
          <div className="site-container team-ribbon-grid">
            {TEAMS.slice(1).map((name, index) => (
              <button className={`team-ribbon-item team-ribbon-${index}`} key={name} onClick={() => {
                setTeam(name)
                document.getElementById('latest')?.scrollIntoView({ behavior: 'smooth' })
              }}>
                <TeamMark team={name} />
                <span><small>TEAM {String(index + 1).padStart(2, '0')}</small><strong>{name}</strong></span>
                <ArrowUpRight size={18} className="team-arrow" />
              </button>
            ))}
          </div>
        </section>

        {homeHighlights.length > 0 && (
          <section className="site-container published-home-section" aria-labelledby="home-highlights-title">
            <div className="section-heading">
              <div>
                <span className="eyebrow"><Sparkles size={15} /> FROM THE COMMUNITY DESK</span>
                <h2 id="home-highlights-title">FEATURED <span>HIGHLIGHTS.</span></h2>
                <p className="section-subtitle">Updates selected by the REBISCOmmunity editors.</p>
              </div>
            </div>
            <div className="published-content-grid">
              {homeHighlights.map(item => (
                <article className="published-content-card" key={item.id}>
                  {item.image_url ? <img src={item.image_url} alt="" loading="lazy" /> : <div className="published-content-art"><Volleyball size={48} /></div>}
                  <div className="published-content-copy">
                    {item.featured && <span className="status-pill status-featured">EDITOR'S PICK</span>}
                    <h3>{item.title}</h3>
                    {item.summary && <p>{item.summary}</p>}
                    {item.body && <p>{item.body}</p>}
                    {item.external_url && <a className="read-link" href={item.external_url} target="_blank" rel="noopener noreferrer">OPEN LINK <ExternalLink size={15} /></a>}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="news-section site-container" id="latest">
          <div className="section-heading">
            <div>
              <span className="eyebrow"><Sparkles size={15} /> THE LATEST</span>
              <h2>THE <span>FEED.</span></h2>
              <p className="section-subtitle">News, match reports, and stories worth sharing.</p>
            </div>
            <div className="feed-count"><span>{String(filtered.length).padStart(2, '0')}</span> STORIES FOUND</div>
          </div>

          <div className="feed-controls">
            <label className="search-field">
              <Search size={18} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search stories, teams..." aria-label="Search stories" />
              {search && <button onClick={() => setSearch('')} aria-label="Clear search"><X size={16} /></button>}
            </label>
            <label className="select-field">
              <Filter size={16} />
              <select value={team} onChange={(event) => setTeam(event.target.value)} aria-label="Filter by team">
                {TEAMS.map((item) => <option key={item}>{item}</option>)}
              </select>
              <ChevronDown size={15} />
            </label>
            <label className="select-field category-select">
              <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter by category">
                {['All Stories', 'News', 'Match Report', 'Announcement', 'Feature'].map((item) => <option key={item}>{item}</option>)}
              </select>
              <ChevronDown size={15} />
            </label>
          </div>

          {error && (
            <div className="notice notice-warning" role="status">
              <ShieldCheck size={21} />
              <div><strong>EDITORIAL FEED NOT CONNECTED</strong><p>{error}</p><a href="/admin">Open the editor setup <ArrowRight size={14} /></a></div>
            </div>
          )}

          {loading ? (
            <div className="empty-state"><span className="loading-spinner" /><p>Loading the fan desk…</p></div>
          ) : !error && filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><Newspaper size={30} /></div>
              <span className="eyebrow">THE NEXT STORY STARTS HERE</span>
              <h3>{articles.length ? 'No stories match your filters.' : 'The feed is warming up.'}</h3>
              <p>{articles.length ? 'Try another team, category, or search term.' : 'No articles have been published yet. Once your editor publishes a verified update, it will appear here.'}</p>
              {articles.length > 0 && <button className="button button-outline" onClick={() => { setTeam('All Teams'); setCategory('All Stories'); setSearch('') }}>CLEAR FILTERS</button>}
            </div>
          ) : !error && featured ? (
            <>
              <div className="featured-story-label"><span className="live-dot" /> LATEST PUBLISHED STORY</div>
              <ArticleCard article={featured} featured onOpen={openArticle} />
              {remaining.length > 0 && (
                <div className="story-grid">
                  {remaining.map((article) => <ArticleCard key={article.id} article={article} onOpen={openArticle} />)}
                </div>
              )}
            </>
          ) : null}
        </section>

        <section className="manifesto">
          <div className="site-container manifesto-inner">
            <div className="manifesto-mark"><Trophy size={31} /></div>
            <div><span className="eyebrow">MORE THAN A SCORELINE</span><h2>THE GAME IS BETTER<br />WHEN WE <span>SHARE IT.</span></h2></div>
            <p>From game-day energy to the stories between matches, REBISCOmmunity brings fans together around the teams they love.</p>
            <a href="/admin" className="manifesto-link">JOIN THE NEWSROOM <ArrowUpRight size={17} /></a>
          </div>
        </section>
      </main>
      <Footer />
      {selected && <ArticleReader article={selected} onClose={() => setSelected(null)} />}
    </>
  )
}

function AdminLogin({ onLogin }: { onLogin: (email: string, password: string) => Promise<string | null> }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError('')
    const message = await onLogin(email.trim(), password)
    setBusy(false)
    if (message) setError(message)
  }

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        <div className="admin-login-icon"><LockKeyhole size={25} /></div>
        <span className="eyebrow">RESTRICTED ACCESS</span>
        <h1>EDITOR <span>LOGIN.</span></h1>
        <p>Sign in with the administrator account created in Supabase. Public registration is not available.</p>
        <form onSubmit={submit} className="editor-form">
          <label>Email address<input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
          <label>Password<input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          {error && <div className="form-error" role="alert">{error}</div>}
          <button className="button button-primary button-full" disabled={busy}>{busy ? 'SIGNING IN…' : 'SIGN IN SECURELY'} <ArrowRight size={17} /></button>
        </form>
        <a href="/" className="back-home"><ArrowLeft size={15} /> BACK TO THE FAN DESK</a>
      </div>
    </div>
  )
}

function AdminDashboard({
  articles,
  onCreate,
  onEdit,
  onDelete,
  onLogout,
  onRefresh,
  onManageSections,
  busy,
  error,
  notice,
}: {
  articles: Article[]
  onCreate: () => void
  onEdit: (article: Article) => void
  onDelete: (article: Article) => void
  onLogout: () => void
  onRefresh: () => void
  onManageSections: () => void
  busy: boolean
  error: string
  notice: string
}) {
  const published = articles.filter((article) => article.status === 'published').length
  const drafts = articles.length - published

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <a href="/" className="brand admin-brand"><span className="brand-icon"><Volleyball size={24} /></span><span className="brand-wordmark">REBISCO<span>mmunity</span><small>EDITORIAL DESK</small></span></a>
        <div className="admin-nav-label">WORKSPACE</div>
        <a className="admin-side-link active" href="/admin"><Newspaper size={17} /> Articles <span>{articles.length}</span></a>
        <button className="admin-side-link" onClick={onManageSections}><FilePenLine size={17} /> Website sections <ArrowRight size={15} /></button>
        <a className="admin-side-link" href="/"><Eye size={17} /> View website <ArrowUpRight size={15} /></a>
        <div className="admin-sidebar-bottom">
          <div className="admin-identity"><span><CircleUserRound size={20} /></span><div><strong>Editor account</strong><small>Authorized session</small></div></div>
          <button className="admin-side-link logout-link" onClick={onLogout}><LogOut size={17} /> Sign out</button>
        </div>
      </aside>
      <main className="admin-main">
        <div className="admin-topbar"><span><span className="live-dot" /> EDITORIAL WORKSPACE</span><a href="/" target="_blank" rel="noreferrer">VIEW LIVE SITE <ExternalLink size={14} /></a></div>
        <div className="admin-content">
          <div className="admin-page-heading">
            <div><span className="eyebrow">YOUR NEWSROOM</span><h1>STORY <span>MANAGEMENT.</span></h1><p>Create, revise, and publish updates for the REBISCOmmunity feed.</p></div>
            <button className="button button-primary" onClick={onCreate}><Plus size={18} /> NEW ARTICLE</button>
          </div>
          {notice && <div className="notice notice-success" role="status"><CheckCircle2 size={19} />{notice}</div>}
          {error && <div className="notice notice-warning" role="alert"><ShieldCheck size={19} />{error}</div>}
          <div className="admin-stat-grid">
            <div className="admin-stat"><span>TOTAL ARTICLES</span><strong>{articles.length}</strong><Newspaper size={22} /></div>
            <div className="admin-stat"><span>PUBLISHED</span><strong>{published}</strong><CheckCircle2 size={22} /></div>
            <div className="admin-stat"><span>DRAFTS</span><strong>{drafts}</strong><FilePenLine size={22} /></div>
          </div>
          <div className="admin-list-heading"><div><h2>ALL ARTICLES</h2><span>{articles.length} total records</span></div><button className="button button-outline button-small" onClick={onRefresh} disabled={busy}>REFRESH <ArrowRight size={15} /></button></div>
          {busy ? <div className="empty-state"><span className="loading-spinner" /><p>Loading articles…</p></div> : articles.length === 0 ? (
            <div className="empty-state admin-empty"><div className="empty-icon"><Newspaper size={30} /></div><h3>Your newsroom is ready.</h3><p>Create your first verified article. Save it as a draft or publish it to the public feed.</p><button className="button button-primary" onClick={onCreate}><Plus size={17} /> CREATE FIRST ARTICLE</button></div>
          ) : (
            <div className="admin-article-list">
              {articles.map((article) => (
                <article className="admin-article-row" key={article.id}>
                  <div className="admin-row-image">{article.image_url ? <img src={article.image_url} alt="" /> : <Volleyball size={27} />}</div>
                  <div className="admin-row-copy"><div className="admin-row-meta"><span className={`status-pill status-${article.status}`}>{article.status}</span><span>{TEAM_SHORT[article.team]}</span><span>{article.category}</span></div><h3>{article.title}</h3><p>{article.excerpt}</p><small>Updated {formatDate(article.updated_at)}</small></div>
                  <div className="admin-row-actions"><button className="icon-button" onClick={() => onEdit(article)} aria-label={`Edit ${article.title}`}><FilePenLine size={18} /></button><button className="icon-button danger-icon" onClick={() => onDelete(article)} aria-label={`Delete ${article.title}`}><Trash2 size={18} /></button></div>
                </article>
              ))}
            </div>
          )}
          <p className="admin-security-note"><ShieldCheck size={16} /> Database permissions are enforced by Supabase Row Level Security, not just by this dashboard.</p>
        </div>
      </main>
    </div>
  )
}

function ArticleEditor({
  article,
  saving,
  error,
  onClose,
  onSave,
}: {
  article: Article | null
  saving: boolean
  error: string
  onClose: () => void
  onSave: (form: ArticleForm) => Promise<void>
}) {
  const [form, setForm] = useState<ArticleForm>(article ? {
    title: article.title,
    slug: article.slug,
    team: article.team,
    category: article.category,
    excerpt: article.excerpt,
    body: article.body,
    image_url: article.image_url ?? '',
    source_url: article.source_url ?? '',
    status: article.status,
  } : EMPTY_FORM)
  const [slugEdited, setSlugEdited] = useState(Boolean(article))
  const [validationError, setValidationError] = useState('')

  function change<K extends keyof ArticleForm>(key: K, value: ArticleForm[K]) {
    setForm((previous) => ({
      ...previous,
      [key]: value,
      ...(key === 'title' && !slugEdited ? { slug: makeSlug(String(value)) } : {}),
    }))
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    setValidationError('')
    if (!isValidHttpUrl(form.image_url) || !isValidHttpUrl(form.source_url)) {
      setValidationError('Image and source links must be valid HTTP or HTTPS URLs.')
      return
    }
    if (!form.slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(form.slug)) {
      setValidationError('Use a URL slug with lowercase letters, numbers, and hyphens only.')
      return
    }
    await onSave(form)
  }

  return (
    <div className="editor-overlay">
      <section className="editor-panel" role="dialog" aria-modal="true" aria-labelledby="editor-title">
        <div className="editor-topbar"><div><span className="eyebrow">EDITORIAL DESK</span><h2 id="editor-title">{article ? 'EDIT STORY' : 'NEW STORY'}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close editor"><X /></button></div>
        <form className="editor-form editor-form-full" onSubmit={submit}>
          <label>Headline *<input required minLength={5} maxLength={180} value={form.title} onChange={(event) => change('title', event.target.value)} placeholder="Write a clear, accurate headline" /></label>
          <label>URL slug *<input required pattern="[a-z0-9]+(-[a-z0-9]+)*" value={form.slug} onChange={(event) => { setSlugEdited(true); change('slug', event.target.value) }} placeholder="example-volleyball-update" /><small>Lowercase letters, numbers, and hyphens only.</small></label>
          <div className="form-two-col">
            <label>Team *<select value={form.team} onChange={(event) => change('team', event.target.value)}>{TEAMS.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label>
            <label>Category *<select value={form.category} onChange={(event) => change('category', event.target.value)}>{['News', 'Match Report', 'Announcement', 'Feature'].map((item) => <option key={item}>{item}</option>)}</select></label>
          </div>
          <label>Short summary *<textarea required minLength={10} maxLength={400} rows={3} value={form.excerpt} onChange={(event) => change('excerpt', event.target.value)} placeholder="Summarize the story in 1–3 sentences." /><small>{form.excerpt.length}/400 characters</small></label>
          <label>Article body *<textarea required minLength={20} maxLength={30000} rows={9} value={form.body} onChange={(event) => change('body', event.target.value)} placeholder="Write the article in plain text. Verify names, dates, scores, and quotations before publishing." /><small>{form.body.length}/30,000 characters</small></label>
          <label>Cover image URL (optional)<input type="url" value={form.image_url} onChange={(event) => change('image_url', event.target.value)} placeholder="https://example.com/authorized-image.jpg" /></label>
          <label>Original source URL (recommended)<input type="url" value={form.source_url} onChange={(event) => change('source_url', event.target.value)} placeholder="https://official-source.example/article" /></label>
          <label>Publication status *<select value={form.status} onChange={(event) => change('status', event.target.value as ArticleForm['status'])}><option value="draft">Draft — visible to editors only</option><option value="published">Published — visible to everyone</option></select></label>
          {validationError && <div className="form-error" role="alert">{validationError}</div>}
          {error && <div className="form-error" role="alert">{error}</div>}
          <div className="editor-actions"><button type="button" className="button button-outline" onClick={onClose}>CANCEL</button><button className="button button-primary" disabled={saving}>{saving ? 'SAVING…' : form.status === 'published' ? 'SAVE & PUBLISH' : 'SAVE DRAFT'} <ArrowRight size={16} /></button></div>
          <p className="editor-hint"><ShieldCheck size={15} /> Publish only verified information and use media you are authorized to share.</p>
        </form>
      </section>
    </div>
  )
}

function SectionContentEditor({
  item,
  saving,
  error,
  onClose,
  onSave,
}: {
  item: SectionContent | null
  saving: boolean
  error: string
  onClose: () => void
  onSave: (form: SectionContentForm) => Promise<void>
}) {
  const [form, setForm] = useState<SectionContentForm>(item ? {
    section: item.section,
    title: item.title,
    slug: item.slug,
    summary: item.summary,
    body: item.body,
    image_url: item.image_url ?? '',
    external_url: item.external_url ?? '',
    metadata: JSON.stringify(item.metadata ?? {}, null, 2),
    status: item.status,
    featured: item.featured,
    sort_order: String(item.sort_order ?? 0),
  } : EMPTY_SECTION_FORM)
  const [slugEdited, setSlugEdited] = useState(Boolean(item))
  const [validationError, setValidationError] = useState('')

  function change<K extends keyof SectionContentForm>(key: K, value: SectionContentForm[K]) {
    setForm(previous => ({
      ...previous,
      [key]: value,
      ...(key === 'title' && !slugEdited ? { slug: makeSlug(String(value)) } : {}),
    }))
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    setValidationError('')
    if (!form.title.trim() || !form.slug.trim()) {
      setValidationError('A title and URL slug are required.')
      return
    }
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(form.slug)) {
      setValidationError('Use lowercase letters, numbers, and hyphens in the slug.')
      return
    }
    if (!isValidHttpUrl(form.image_url) || !isValidHttpUrl(form.external_url)) {
      setValidationError('Image and external links must be valid HTTP or HTTPS URLs.')
      return
    }
    try {
      const metadata = JSON.parse(form.metadata || '{}')
      if (!metadata || Array.isArray(metadata) || typeof metadata !== 'object') {
        setValidationError('Metadata must be a JSON object, for example: {"season":"2026"}.')
        return
      }
    } catch {
      setValidationError('Metadata must be valid JSON, for example: {"season":"2026"}.')
      return
    }
    await onSave(form)
  }

  return (
    <div className="editor-overlay">
      <section className="editor-panel" role="dialog" aria-modal="true" aria-labelledby="section-editor-title">
        <div className="editor-topbar">
          <div><span className="eyebrow">WEBSITE CONTENT</span><h2 id="section-editor-title">{item ? 'EDIT SECTION ITEM' : 'NEW SECTION ITEM'}</h2></div>
          <button className="icon-button" onClick={onClose} aria-label="Close section editor"><X /></button>
        </div>
        <form className="editor-form editor-form-full" onSubmit={submit}>
          <label>Website section *
            <select value={form.section} onChange={event => change('section', event.target.value as ContentSection)}>
              {CONTENT_SECTIONS.map(section => <option key={section.value} value={section.value}>{section.label}</option>)}
            </select>
          </label>
          <label>Title *<input required maxLength={180} value={form.title} onChange={event => change('title', event.target.value)} placeholder="Content title" /></label>
          <label>URL slug *<input required pattern="[a-z0-9]+(-[a-z0-9]+)*" value={form.slug} onChange={event => { setSlugEdited(true); change('slug', event.target.value) }} placeholder="content-item-slug" /><small>Unique within the selected section.</small></label>
          <label>Short summary<textarea rows={3} maxLength={600} value={form.summary} onChange={event => change('summary', event.target.value)} placeholder="A short introduction shown in listings." /></label>
          <label>Content / details<textarea rows={7} maxLength={30000} value={form.body} onChange={event => change('body', event.target.value)} placeholder="Add verified information. For schedules or stats, include season and source details." /></label>
          <div className="form-two-col">
            <label>Image URL<input type="url" value={form.image_url} onChange={event => change('image_url', event.target.value)} placeholder="https://..." /></label>
            <label>External / official URL<input type="url" value={form.external_url} onChange={event => change('external_url', event.target.value)} placeholder="https://..." /></label>
          </div>
          <label>Metadata (JSON object)<textarea rows={4} value={form.metadata} onChange={event => change('metadata', event.target.value)} spellCheck={false} placeholder={'{"season":"2026","venue":"..."}'} /><small>Optional structured fields for players, matches, standings, or statistics.</small></label>
          <div className="form-two-col">
            <label>Display order<input type="number" step="1" value={form.sort_order} onChange={event => change('sort_order', event.target.value)} /></label>
            <label>Publication status<select value={form.status} onChange={event => change('status', event.target.value as SectionContentForm['status'])}><option value="draft">Draft — private</option><option value="published">Published — public</option></select></label>
          </div>
          <label className="editor-checkbox-label"><input type="checkbox" checked={form.featured} onChange={event => change('featured', event.target.checked)} /> Feature this item in its section</label>
          {validationError && <div className="form-error" role="alert">{validationError}</div>}
          {error && <div className="form-error" role="alert">{error}</div>}
          <div className="editor-actions"><button type="button" className="button button-outline" onClick={onClose}>CANCEL</button><button className="button button-primary" disabled={saving}>{saving ? 'SAVING…' : form.status === 'published' ? 'SAVE & PUBLISH' : 'SAVE DRAFT'} <ArrowRight size={16} /></button></div>
          <p className="editor-hint"><ShieldCheck size={15} /> Public pages can read published items. Supabase RLS controls who can change them.</p>
        </form>
      </section>
    </div>
  )
}

function SectionContentDashboard({
  items,
  loading,
  error,
  notice,
  onCreate,
  onEdit,
  onDelete,
  onRefresh,
  onBack,
  onLogout,
}: {
  items: SectionContent[]
  loading: boolean
  error: string
  notice: string
  onCreate: () => void
  onEdit: (item: SectionContent) => void
  onDelete: (item: SectionContent) => void
  onRefresh: () => void
  onBack: () => void
  onLogout: () => void
}) {
  const [sectionFilter, setSectionFilter] = useState<ContentSection | 'all'>('all')
  const visibleItems = items.filter(item => sectionFilter === 'all' || item.section === sectionFilter)
  const publishedCount = items.filter(item => item.status === 'published').length
  const draftCount = items.length - publishedCount
  const sectionLabel = (value: string) => CONTENT_SECTIONS.find(section => section.value === value)?.label ?? value

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <a href="/" className="brand admin-brand"><span className="brand-icon"><Volleyball size={24} /></span><span className="brand-wordmark">REBISCO<span>mmunity</span><small>EDITORIAL DESK</small></span></a>
        <div className="admin-nav-label">WORKSPACE</div>
        <button className="admin-side-link" onClick={onBack}><Newspaper size={17} /> Articles</button>
        <button className="admin-side-link active"><FilePenLine size={17} /> Website sections <span>{items.length}</span></button>
        <a className="admin-side-link" href="/" target="_blank" rel="noreferrer"><Eye size={17} /> View website <ArrowUpRight size={15} /></a>
        <div className="admin-sidebar-bottom">
          <div className="admin-identity"><span><CircleUserRound size={20} /></span><div><strong>Editor account</strong><small>Authorized session</small></div></div>
          <button className="admin-side-link logout-link" onClick={onLogout}><LogOut size={17} /> Sign out</button>
        </div>
      </aside>
      <main className="admin-main">
        <div className="admin-topbar"><span><span className="live-dot" /> WEBSITE CONTENT MANAGER</span><a href="/" target="_blank" rel="noreferrer">VIEW LIVE SITE <ExternalLink size={14} /></a></div>
        <div className="admin-content">
          <div className="admin-page-heading"><div><span className="eyebrow">CONTENT STUDIO</span><h1>SECTION <span>MANAGEMENT.</span></h1><p>Manage homepage highlights and content records for all website sections.</p></div><button className="button button-primary" onClick={onCreate}><Plus size={18} /> NEW CONTENT</button></div>
          {notice && <div className="notice notice-success" role="status"><CheckCircle2 size={19} />{notice}</div>}
          {error && <div className="notice notice-warning" role="alert"><ShieldCheck size={19} />{error}</div>}
          <div className="admin-stat-grid"><div className="admin-stat"><span>TOTAL CONTENT</span><strong>{items.length}</strong><FilePenLine size={22} /></div><div className="admin-stat"><span>PUBLISHED</span><strong>{publishedCount}</strong><CheckCircle2 size={22} /></div><div className="admin-stat"><span>DRAFTS</span><strong>{draftCount}</strong><Newspaper size={22} /></div></div>
          <div className="section-manager-controls"><label className="select-field"><Filter size={16} /><select aria-label="Filter by website section" value={sectionFilter} onChange={event => setSectionFilter(event.target.value as ContentSection | 'all')}><option value="all">All website sections</option>{CONTENT_SECTIONS.map(section => <option key={section.value} value={section.value}>{section.label}</option>)}</select><ChevronDown size={15} /></label><button className="button button-outline button-small" onClick={onRefresh} disabled={loading}>REFRESH <ArrowRight size={15} /></button></div>
          <div className="admin-list-heading"><div><h2>CONTENT ITEMS</h2><span>{visibleItems.length} records shown</span></div></div>
          {loading ? <div className="empty-state"><span className="loading-spinner" /><p>Loading website content…</p></div> : visibleItems.length === 0 ? <div className="empty-state"><div className="empty-icon"><FilePenLine size={30} /></div><h3>No content in this view yet.</h3><p>Create a content item for a section. Drafts remain private; published records become available to public pages once connected.</p><button className="button button-primary" onClick={onCreate}><Plus size={17} /> CREATE CONTENT</button></div> : <div className="admin-article-list">{visibleItems.map(item => <article className="admin-article-row" key={item.id}><div className="admin-row-image">{item.image_url ? <img src={item.image_url} alt="" /> : <FilePenLine size={25} />}</div><div className="admin-row-copy"><div className="admin-row-meta"><span className={`status-pill status-${item.status}`}>{item.status}</span><span>{sectionLabel(item.section)}</span>{item.featured && <span className="status-pill status-featured">FEATURED</span>}</div><h3>{item.title}</h3><p>{item.summary || item.body.slice(0, 150) || 'No summary added.'}</p><small>/{item.section}/{item.slug} · Updated {formatDate(item.updated_at)}</small></div><div className="admin-row-actions"><button className="icon-button" onClick={() => onEdit(item)} aria-label={`Edit ${item.title}`}><FilePenLine size={18} /></button><button className="icon-button danger-icon" onClick={() => onDelete(item)} aria-label={`Delete ${item.title}`}><Trash2 size={18} /></button></div></article>)}</div>}
          <p className="admin-security-note"><ShieldCheck size={16} /> This manager uses the existing Supabase admin allowlist and section_content RLS policies.</p>
        </div>
      </main>
    </div>
  )
}

function AdminApp() {
  const [sessionReady, setSessionReady] = useState(false)
  const [sessionUser, setSessionUser] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [articles, setArticles] = useState<Article[]>([])
  const [sectionItems, setSectionItems] = useState<SectionContent[]>([])
  const [adminView, setAdminView] = useState<'articles' | 'sections'>('articles')
  const [sectionLoading, setSectionLoading] = useState(false)
  const [sectionSaving, setSectionSaving] = useState(false)
  const [editingSection, setEditingSection] = useState<SectionContent | null | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState<Article | null | undefined>(undefined)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  async function checkAdmin(userId: string) {
    if (!supabase) return false
    const { data, error: checkError } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle()
    if (checkError) throw checkError
    return Boolean(data)
  }

  async function refreshArticles() {
    if (!supabase || !isAdmin) return
    setLoading(true)
    setError('')
    const { data, error: queryError } = await supabase
      .from('articles')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(200)
    if (queryError) setError('Could not load articles. Verify the database SQL and your administrator permissions.')
    else setArticles((data ?? []) as Article[])
    setLoading(false)
  }

  async function refreshSectionContent() {
    if (!supabase || !isAdmin) return
    setSectionLoading(true)
    setError('')
    const { data, error: queryError } = await supabase
      .from('section_content')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(500)
    if (queryError) setError('Could not load section content. Confirm the section_content SQL succeeded and your admin_users permissions are correct.')
    else setSectionItems((data ?? []) as SectionContent[])
    setSectionLoading(false)
  }

  async function saveSectionContent(form: SectionContentForm) {
    if (!supabase || !sessionUser || !isAdmin) {
      setError('Your administrator session is not valid. Sign in again.')
      return
    }
    setSectionSaving(true)
    setError('')
    let metadata: Record<string, unknown>
    try {
      metadata = JSON.parse(form.metadata || '{}') as Record<string, unknown>
    } catch {
      setError('Metadata must be valid JSON.')
      setSectionSaving(false)
      return
    }
    const payload = {
      section: form.section,
      title: form.title.trim(),
      slug: form.slug.trim(),
      summary: form.summary.trim(),
      body: form.body.trim(),
      image_url: form.image_url.trim() || null,
      external_url: form.external_url.trim() || null,
      metadata,
      status: form.status,
      featured: form.featured,
      sort_order: Number.parseInt(form.sort_order || '0', 10) || 0,
      published_at: form.status === 'published'
        ? (editingSection && editingSection.published_at ? editingSection.published_at : new Date().toISOString())
        : null,
      created_by: editingSection && editingSection.created_by ? editingSection.created_by : sessionUser,
      updated_at: new Date().toISOString(),
    }
    const result = editingSection
      ? await supabase.from('section_content').update(payload).eq('id', editingSection.id)
      : await supabase.from('section_content').insert(payload)
    if (result.error) {
      setError(result.error.code === '23505'
        ? 'That slug is already used in this section. Choose a different slug.'
        : 'Could not save content. Check the section_content columns and Supabase administrator policies.')
      setSectionSaving(false)
      return
    }
    setNotice(form.status === 'published' ? 'Section content saved and published.' : 'Section draft saved.')
    setEditingSection(undefined)
    await refreshSectionContent()
    setSectionSaving(false)
  }

  async function deleteSectionContent(item: SectionContent) {
    if (!supabase || !isAdmin) return
    if (!window.confirm(`Permanently delete "${item.title}" from ${item.section}? This cannot be undone.`)) return
    setError('')
    const { error: deleteError } = await supabase.from('section_content').delete().eq('id', item.id)
    if (deleteError) setError('Content could not be deleted. Check your administrator permissions.')
    else {
      setNotice('Section content deleted.')
      await refreshSectionContent()
    }
  }

  useEffect(() => {
    if (!supabase) {
      setSessionReady(true)
      return
    }
    let active = true
    async function initialize() {
      const { data } = await supabase!.auth.getSession()
      if (!active) return
      const userId = data.session?.user.id ?? null
      setSessionUser(userId)
      if (userId) {
        try { setIsAdmin(await checkAdmin(userId)) }
        catch { setError('Could not verify administrator access. Check the Supabase admin_users policy and SQL setup.') }
      }
      setSessionReady(true)
    }
    void initialize()
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return
      setSessionUser(session?.user.id ?? null)
      if (!session) {
        setIsAdmin(false)
        setArticles([])
        setSessionReady(true)
      } else {
        window.setTimeout(() => {
          void checkAdmin(session.user.id)
            .then((allowed) => { if (active) setIsAdmin(allowed) })
            .catch(() => { if (active) setError('Unable to verify your administrator role.') })
        }, 0)
      }
    })
    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (sessionReady && sessionUser && isAdmin) {
      if (adminView === 'articles') void refreshArticles()
      else void refreshSectionContent()
    }
  }, [sessionReady, sessionUser, isAdmin, adminView])

  async function login(email: string, password: string): Promise<string | null> {
    if (!supabase) return 'Supabase is not configured. Add your environment variables and restart Vite.'
    const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password })
    if (loginError || !data.user) return 'Sign-in failed. Check your credentials and Supabase Auth settings.'
    try {
      const allowed = await checkAdmin(data.user.id)
      if (!allowed) {
        await supabase.auth.signOut()
        return 'This account is not on the administrator allowlist.'
      }
      setSessionUser(data.user.id)
      setIsAdmin(true)
      setNotice('Signed in. Your editorial workspace is ready.')
      return null
    } catch {
      await supabase.auth.signOut()
      return 'Unable to verify administrator permissions. Check your database setup.'
    }
  }

  async function saveArticle(form: ArticleForm) {
    if (!supabase || !sessionUser || !isAdmin) {
      setError('Your administrator session is not valid. Sign in again.')
      return
    }
    setSaving(true)
    setError('')
    const publishedAt = form.status === 'published'
      ? (editing && editing !== undefined && editing.published_at ? editing.published_at : new Date().toISOString())
      : null
    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      team: form.team,
      category: form.category,
      excerpt: form.excerpt.trim(),
      body: form.body.trim(),
      image_url: form.image_url.trim() || null,
      source_url: form.source_url.trim() || null,
      status: form.status,
      published_at: publishedAt,
      author_id: sessionUser,
      updated_at: new Date().toISOString(),
    }

    const result = editing
      ? await supabase.from('articles').update(payload).eq('id', editing.id)
      : await supabase.from('articles').insert(payload)

    if (result.error) {
      setError(result.error.code === '23505'
        ? 'That URL slug is already in use. Choose a unique slug.'
        : 'The article could not be saved. Check the database error, validation rules, and administrator permissions.')
      setSaving(false)
      return
    }

    setNotice(form.status === 'published' ? 'Article saved and published.' : 'Draft saved successfully.')
    setEditing(undefined)
    await refreshArticles()
    setSaving(false)
  }

  async function deleteArticle(article: Article) {
    if (!supabase || !isAdmin) return
    if (!window.confirm(`Permanently delete "${article.title}"? This cannot be undone.`)) return
    setError('')
    const { error: deleteError } = await supabase.from('articles').delete().eq('id', article.id)
    if (deleteError) setError('Article could not be deleted. Check your administrator permissions.')
    else {
      setNotice('Article deleted.')
      await refreshArticles()
    }
  }

  async function logout() {
    if (supabase) await supabase.auth.signOut()
    setSessionUser(null)
    setIsAdmin(false)
    setArticles([])
    setSectionItems([])
    setAdminView('articles')
    setNotice('')
    setError('')
  }

  if (!supabase) {
    return (
      <>
        <Header admin />
        <main className="setup-screen site-container">
          <div className="setup-card">
            <ShieldCheck size={36} />
            <span className="eyebrow">ONE-TIME SETUP</span>
            <h1>CONNECT THE <span>NEWSROOM.</span></h1>
            <p>The admin dashboard needs your Supabase project URL and publishable key.</p>
            <ol>
              <li>Create `.env.local` beside `package.json`.</li>
              <li>Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.</li>
              <li>Save the file and restart the Vite server.</li>
              <li>Run the SQL setup and create your administrator account.</li>
            </ol>
            <a href="/" className="button button-outline">BACK TO HOMEPAGE <ArrowLeft size={16} /></a>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!sessionReady) return <div className="full-screen-loading"><span className="loading-spinner" /> Verifying session…</div>

  if (!sessionUser || !isAdmin) {
    return (
      <>
        <Header admin />
        {sessionUser && !isAdmin ? (
          <main className="setup-screen site-container"><div className="setup-card"><ShieldCheck size={36} /><h1>ADMIN ACCESS <span>REQUIRED.</span></h1><p>This account is not authorized to manage articles.</p>{error && <p role="alert">{error}</p>}<button className="button button-primary" onClick={logout}>SIGN OUT <LogOut size={16} /></button></div></main>
        ) : (
          <AdminLogin onLogin={login} />
        )}
        <Footer />
      </>
    )
  }

  return (
    <>
      {adminView === 'articles' ? (
        <AdminDashboard
          articles={articles}
          onCreate={() => { setError(''); setEditing(null) }}
          onEdit={(article) => { setError(''); setEditing(article) }}
          onDelete={(article) => void deleteArticle(article)}
          onLogout={() => void logout()}
          onRefresh={() => void refreshArticles()}
          onManageSections={() => { setError(''); setNotice(''); setAdminView('sections') }}
          busy={loading}
          error={error}
          notice={notice}
        />
      ) : (
        <SectionContentDashboard
          items={sectionItems}
          loading={sectionLoading}
          error={error}
          notice={notice}
          onCreate={() => { setError(''); setEditingSection(null) }}
          onEdit={(item) => { setError(''); setEditingSection(item) }}
          onDelete={(item) => void deleteSectionContent(item)}
          onRefresh={() => void refreshSectionContent()}
          onBack={() => { setError(''); setNotice(''); setAdminView('articles') }}
          onLogout={() => void logout()}
        />
      )}
      {editing !== undefined && adminView === 'articles' && (
        <ArticleEditor
          key={editing?.id ?? 'new-article'}
          article={editing}
          saving={saving}
          error={error}
          onClose={() => { setEditing(undefined); setError('') }}
          onSave={saveArticle}
        />
      )}
      {editingSection !== undefined && adminView === 'sections' && (
        <SectionContentEditor
          key={editingSection?.id ?? 'new-section-content'}
          item={editingSection}
          saving={sectionSaving}
          error={error}
          onClose={() => { setEditingSection(undefined); setError('') }}
          onSave={saveSectionContent}
        />
      )}
    </>
  )
}

type SectionConfig = {
  title: string
  accent: string
  eyebrow: string
  description: string
  icon: typeof Newspaper
  status: string
  items?: { title: string; description: string; href?: string }[]
}

const SECTION_CONFIG: Record<string, SectionConfig> = {
  teams: {
    title: 'OUR TEAMS', accent: 'THREE TEAMS. ONE COMMUNITY.', eyebrow: 'MEET THE SQUADS',
    description: 'Follow the teams at the heart of REBISCOmmunity. Team profiles are fan guides; official announcements remain the source of truth.',
    icon: Trophy, status: 'Team overview',
    items: [
      { title: 'Creamline Cool Smashers', description: 'The pink-powered squad. Find team-related stories and published updates.', href: '/news' },
      { title: 'Choco Mucho Flying Titans', description: 'Follow the Flying Titans through the latest community coverage.', href: '/news' },
      { title: 'Criss Cross King Crunchers', description: 'Keep up with King Crunchers stories and community updates.', href: '/news' },
    ],
  },
  players: { title: 'PLAYER DESK', accent: 'THE PEOPLE BEHIND THE PLAYS.', eyebrow: 'PLAYER PROFILES', description: 'A home for player profiles, team affiliations, and stories. Profiles will be added as information is verified from reliable sources.', icon: CircleUserRound, status: 'Player profiles are not connected yet' },
  standings: { title: 'STANDINGS', accent: 'EVERY SET COUNTS.', eyebrow: 'COMPETITION TRACKER', description: 'Follow the race through the standings. Rankings will be published only when competition, season, and source data can be verified.', icon: Trophy, status: 'Verified standings data is not connected yet' },
  schedule: { title: 'MATCH SCHEDULE', accent: 'SAVE THE DATE. BRING THE NOISE.', eyebrow: 'UP NEXT', description: 'A match-day hub for upcoming fixtures, start times, and venues. Check official league and team channels before making plans.', icon: Newspaper, status: 'Verified schedule data is not connected yet' },
  recaps: { title: 'MATCH RECAPS', accent: 'RELIVE EVERY RALLY.', eyebrow: 'AFTER THE FINAL WHISTLE', description: 'Match reports and post-game stories belong here. Browse published articles while recap-specific tagging is being developed.', icon: ArrowUpRight, status: 'Recap articles will appear as they are published' },
  live: { title: 'LIVE CENTER', accent: 'MATCH DAY, ALL THE ENERGY.', eyebrow: 'LIVE COVERAGE', description: 'This page will host verified live links and match-day updates when available. No match is marked live unless coverage is confirmed.', icon: Sparkles, status: 'No verified live coverage is connected right now' },
  videos: { title: 'VIDEO ZONE', accent: 'BIG PLAYS. BIG FEELINGS.', eyebrow: 'WATCH', description: 'A curated home for authorized highlights, interviews, and volleyball videos from official or otherwise permitted sources.', icon: Eye, status: 'Video sources have not been connected yet' },
  photos: { title: 'PHOTO GALLERY', accent: 'MOMENTS WORTH KEEPING.', eyebrow: 'THROUGH THE LENS', description: 'Match-day galleries and community moments will be added when images are authorized for sharing and properly credited.', icon: Sparkles, status: 'No authorized gallery images have been added yet' },
  stats: { title: 'STATS DESK', accent: 'THE NUMBERS BEHIND THE GAME.', eyebrow: 'TEAM & PLAYER DATA', description: 'Explore verified team and player statistics with competition and season identified. We do not invent official stats.', icon: Filter, status: 'Verified statistics data is not connected yet' },
  tickets: { title: 'TICKETS & ATTENDANCE', accent: 'BE THERE FOR THE NEXT RALLY.', eyebrow: 'PLAN YOUR GAME DAY', description: 'Use official event and ticketing sources to check availability, venue details, and prices. REBISCOmmunity does not sell tickets directly.', icon: ExternalLink, status: 'Official ticket links will be listed when verified' },
}

function SectionPage({ sectionKey }: { sectionKey: string }) {
  const config = SECTION_CONFIG[sectionKey]
  const Icon = config.icon
  const [items, setItems] = useState<SectionContent[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let active = true
    async function loadSection() {
      if (!supabase) {
        setLoadError('The content service is not configured. Please try again later.')
        setLoading(false)
        return
      }
      const { data, error: queryError } = await supabase
        .from('section_content')
        .select('*')
        .eq('section', sectionKey)
        .eq('status', 'published')
        .not('published_at', 'is', null)
        .lte('published_at', new Date().toISOString())
        .order('featured', { ascending: false })
        .order('sort_order', { ascending: true })
        .order('published_at', { ascending: false })
        .limit(100)
      if (!active) return
      if (queryError) setLoadError('We could not load this section. Please try again later.')
      else setItems((data ?? []) as SectionContent[])
      setLoading(false)
    }
    void loadSection()
    return () => { active = false }
  }, [sectionKey])

  const fallbackTeams = sectionKey === 'teams' && items.length === 0 ? config.items : undefined

  return (
    <>
      <Header />
      <main className="section-page">
        <section className="section-page-hero">
          <div className="site-container section-page-hero-inner">
            <span className="eyebrow"><Icon size={15} /> {config.eyebrow}</span>
            <h1>{config.title}<br /><span>{config.accent}</span></h1>
            <p>{config.description}</p>
            <div className="section-page-actions">
              <a className="button button-primary" href="/news">LATEST NEWS <ArrowUpRight size={17} /></a>
              <a className="button button-outline" href="/teams">EXPLORE OUR TEAMS <ArrowRight size={17} /></a>
            </div>
          </div>
        </section>
        <section className="site-container section-page-content">
          {loadError && <div className="notice notice-warning" role="status"><ShieldCheck size={20} /><p>{loadError}</p></div>}
          {loading ? (
            <div className="empty-state"><span className="loading-spinner" /><p>Loading published content…</p></div>
          ) : items.length > 0 ? (
            <div className="published-content-grid">
              {items.map(item => (
                <article className="published-content-card" key={item.id}>
                  {item.image_url ? <img src={item.image_url} alt="" loading="lazy" /> : <div className="published-content-art"><Icon size={44} /></div>}
                  <div className="published-content-copy">
                    {item.featured && <span className="status-pill status-featured">FEATURED</span>}
                    <h2>{item.title}</h2>
                    {item.summary && <p>{item.summary}</p>}
                    {item.body && <p className="published-content-body">{item.body}</p>}
                    {item.external_url && <a className="read-link" href={item.external_url} target="_blank" rel="noopener noreferrer">OFFICIAL / MORE INFO <ExternalLink size={15} /></a>}
                  </div>
                </article>
              ))}
            </div>
          ) : fallbackTeams ? (
            <div className="section-team-grid">
              {fallbackTeams.map((item, index) => (
                <article className={`section-team-card section-team-card-${index}`} key={item.title}>
                  <span className="section-team-number">0{index + 1}</span>
                  <div className="section-team-icon"><Volleyball size={34} /></div>
                  <h2>{item.title}</h2>
                  <p>{item.description}</p>
                  <a className="read-link" href={item.href}>EXPLORE TEAM STORIES <ArrowUpRight size={16} /></a>
                </article>
              ))}
            </div>
          ) : (
            <div className="section-empty-state">
              <div className="empty-icon"><Icon size={28} /></div>
              <span className="eyebrow">CONTENT DESK</span>
              <h2>{config.status}</h2>
              <p>No published entries are available for this page yet. Create a content item in the admin dashboard and publish it to make it appear here. Drafts remain hidden from public visitors.</p>
              <a className="button button-primary" href="/admin">OPEN THE NEWSROOM <ArrowRight size={17} /></a>
            </div>
          )}
        </section>
        <section className="section-page-bottom">
          <div className="site-container section-page-bottom-inner">
            <div><span className="eyebrow">ONE COMMUNITY. THREE TEAMS.</span><h2>THE GAME IS BETTER<br />WHEN WE <span>SHARE IT.</span></h2></div>
            <a className="button button-outline" href="/admin">OPEN THE NEWSROOM <ArrowUpRight size={16} /></a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  if (path === '/admin') return <AdminApp />
  if (path === '/' || path === '/news') return <PublicHome />
  const sectionKey = path.slice(1)
  if (SECTION_CONFIG[sectionKey]) return <SectionPage sectionKey={sectionKey} />
  return (
    <>
      <Header />
      <main className="site-container section-not-found">
        <span className="eyebrow">404 — OUT OF ROTATION</span>
        <h1>THIS PAGE ISN'T<br /><span>IN PLAY.</span></h1>
        <p>That page could not be found. Head back to the fan desk and keep following the game.</p>
        <a className="button button-primary" href="/">BACK TO HOME <ArrowLeft size={17} /></a>
      </main>
      <Footer />
    </>
  )
}