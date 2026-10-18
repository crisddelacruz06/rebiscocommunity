
import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShieldCheck,
  Trophy,
  Users,
  Volleyball,
  X,
  Zap,
} from "lucide-react";

type Team = "All teams" | "Creamline" | "Choco Mucho" | "Criss Cross";

type Story = {
  id: number;
  category: string;
  team: Exclude<Team, "All teams"> | "Community";
  title: string;
  description: string;
  readTime: string;
  style: string;
  featured?: boolean;
};

const teams = [
  {
    name: "Creamline",
    nickname: "Cool Smashers",
    short: "CS",
    accent: "pink",
    description: "The heart, the hustle, the smash.",
    competition: "Women's volleyball",
  },
  {
    name: "Choco Mucho",
    nickname: "Flying Titans",
    short: "CM",
    accent: "purple",
    description: "Fly high. Fight together.",
    competition: "Women's volleyball",
  },
  {
    name: "Criss Cross",
    nickname: "King Crunchers",
    short: "CC",
    accent: "orange",
    description: "Power, precision, and pride.",
    competition: "Men's volleyball",
  },
];

const stories: Story[] = [
  {
    id: 1,
    category: "FAN CULTURE",
    team: "Community",
    title: "Three teams. Three journeys. One volleyball family.",
    description:
      "Welcome to a space where every rally brings fans together and every team has a place to shine.",
    readTime: "Community feature",
    style: "story-pink",
    featured: true,
  },
  {
    id: 2,
    category: "TEAM SPOTLIGHT",
    team: "Creamline",
    title: "Meet the Cool Smashers",
    description:
      "Get to know the team, follow its journey, and join the conversation with fellow supporters.",
    readTime: "Team guide",
    style: "story-purple",
  },
  {
    id: 3,
    category: "TEAM SPOTLIGHT",
    team: "Choco Mucho",
    title: "All eyes on the Flying Titans",
    description:
      "Your fan hub for team stories, verified announcements, and moments worth celebrating.",
    readTime: "Team guide",
    style: "story-orange",
  },
  {
    id: 4,
    category: "TEAM SPOTLIGHT",
    team: "Criss Cross",
    title: "Get to know the King Crunchers",
    description:
      "Follow the men's volleyball team and connect with supporters who love the game.",
    readTime: "Team guide",
    style: "story-blue",
  },
  {
    id: 5,
    category: "VOLLEYBALL 101",
    team: "Community",
    title: "New to volleyball? Start here.",
    description:
      "A beginner-friendly guide to sets, rotations, positions, and the details that make every rally exciting.",
    readTime: "Beginner's guide",
    style: "story-green",
  },
];

const filters: Team[] = [
  "All teams",
  "Creamline",
  "Choco Mucho",
  "Criss Cross",
];

function App() {
  const [activeFilter, setActiveFilter] = useState<Team>("All teams");
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedStory, setExpandedStory] = useState<number | null>(null);
  const [vote, setVote] = useState<Team | null>(null);
  const [voteSubmitted, setVoteSubmitted] = useState(false);

  const filteredStories = useMemo(() => {
    const query = search.trim().toLowerCase();

    return stories.filter((story) => {
      const matchesTeam =
        activeFilter === "All teams" ||
        story.team === activeFilter ||
        story.team === "Community";

      const matchesSearch =
        !query ||
        `${story.title} ${story.description} ${story.team} ${story.category}`
          .toLowerCase()
          .includes(query);

      return matchesTeam && matchesSearch;
    });
  }, [activeFilter, search]);

  function goTo(id: string) {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function resetFilters() {
    setActiveFilter("All teams");
    setSearch("");
    setSearchOpen(false);
    goTo("updates");
  }

  function submitPoll() {
    if (!vote) return;

    // Local demonstration only. Votes are not sent to a server.
    setVoteSubmitted(true);
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <div className="announcement">
        <span className="live-dot" aria-hidden="true" />
        <span>
          THE FAN HUB FOR REBISCO VOLLEYBALL
        </span>
        <span className="announcement-divider" aria-hidden="true">
          /
        </span>
        <span className="announcement-detail">
          One community. Three teams.
        </span>
      </div>

      <header className="site-header">
        <a
          className="brand"
          href="#home"
          aria-label="REBISCOmmunity home"
        >
          <span className="brand-mark" aria-hidden="true">
            <Volleyball size={27} strokeWidth={1.8} />
          </span>
          <span className="brand-word">
            REBISCO<span>mmunity</span>
            <small>THE VOLLEYBALL FAN HUB</small>
          </span>
        </a>

        <nav
          className={`main-nav ${mobileOpen ? "nav-open" : ""}`}
          id="main-navigation"
          aria-label="Main navigation"
        >
          <a href="#updates" onClick={() => setMobileOpen(false)}>
            The latest
          </a>
          <a href="#teams" onClick={() => setMobileOpen(false)}>
            Our teams
          </a>
          <a href="#matches" onClick={() => setMobileOpen(false)}>
            Match center
          </a>
          <a href="#community" onClick={() => setMobileOpen(false)}>
            Community
          </a>
        </nav>

        <div className="header-actions">
          <button
            className="icon-button search-toggle"
            type="button"
            aria-label={searchOpen ? "Close search" : "Open search"}
            aria-expanded={searchOpen}
            onClick={() => {
              setSearchOpen((open) => !open);
              if (searchOpen) setSearch("");
              else goTo("updates");
            }}
          >
            {searchOpen ? <X size={19} /> : <Search size={19} />}
          </button>

          <button
            className="button button-small button-primary desktop-cta"
            type="button"
            onClick={() => goTo("community")}
          >
            Join the fam <ArrowUpRight size={16} />
          </button>

          <button
            className="icon-button menu-toggle"
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="main-navigation"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      <main id="main">
        <section className="hero section-wrap" id="home">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-line" />
              YOUR COURTSIDE COMMUNITY
            </div>

            <h1>
              MORE THAN
              <br />
              A GAME.
              <br />
              <span className="gradient-text">WE'RE FAMILY.</span>
            </h1>

            <p className="hero-description">
              Every rally has a story. Every team has a
              community. Get your volleyball fix, celebrate
              your favorites, and find your people here.
            </p>

            <div className="hero-actions">
              <button
                className="button button-primary"
                type="button"
                onClick={() => goTo("updates")}
              >
                Explore the latest <ArrowRight size={17} />
              </button>
              <button
                className="button button-outline"
                type="button"
                onClick={() => goTo("teams")}
              >
                Meet the teams <ArrowDownRight size={17} />
              </button>
            </div>

            <div className="hero-note">
              <span className="avatar-stack" aria-hidden="true">
                <span>C</span>
                <span>M</span>
                <span>X</span>
              </span>
              <span>
                Three teams.
                <strong> One volleyball family.</strong>
              </span>
            </div>
          </div>

          <div className="hero-art" aria-label="Three-team community graphic">
            <div className="art-orbit orbit-one" />
            <div className="art-orbit orbit-two" />
            <div className="art-star star-one">✳</div>
            <div className="art-star star-two">✦</div>

            <div className="hero-sticker sticker-top">
              <Zap size={15} />
              ALL HEART
            </div>

            <div className="hero-ball">
              <Volleyball
                size={150}
                strokeWidth={0.85}
                aria-hidden="true"
              />
              <span className="ball-label">PLAY AS ONE</span>
            </div>

            <div className="hero-sticker sticker-bottom">
              <Heart size={15} fill="currentColor" />
              ALL IN
            </div>

            <div className="art-team art-team-one">
              <span className="team-dot pink" />
              CREAMLINE
            </div>
            <div className="art-team art-team-two">
              <span className="team-dot purple" />
              CHOCO MUCHO
            </div>
            <div className="art-team art-team-three">
              <span className="team-dot orange" />
              CRISS CROSS
            </div>
          </div>

          <div className="hero-bottom">
            <span>BUILT BY FANS, FOR FANS.</span>
            <a href="#teams">
              MEET YOUR TEAMS <ArrowDownRight size={14} />
            </a>
          </div>
        </section>

        <section className="team-strip" id="teams">
          <div className="section-wrap">
            <div className="section-heading team-heading">
              <div>
                <div className="eyebrow">
                  <span className="eyebrow-line" />
                  THREE TEAMS. ONE HOME.
                </div>
                <h2>
                  Pick your <span className="gradient-text">side.</span>
                </h2>
              </div>
              <p>
                Different colors. Different journeys.
                <br />
                All welcome in this community.
              </p>
            </div>

            <div className="team-grid">
              {teams.map((team, index) => (
                <article
                  className={`team-card team-${team.accent}`}
                  key={team.name}
                >
                  <div className="team-card-top">
                    <span className="team-index">
                      0{index + 1} / TEAM
                    </span>
                    <span className="team-monogram">
                      {team.short}
                    </span>
                  </div>

                  <div className="team-emblem" aria-hidden="true">
                    <Volleyball size={53} strokeWidth={1.1} />
                  </div>

                  <div className="team-card-copy">
                    <p className="team-competition">
                      {team.competition}
                    </p>
                    <h3>{team.name}</h3>
                    <p className="team-nickname">{team.nickname}</p>
                    <p className="team-description">
                      {team.description}
                    </p>
                  </div>

                  <button
                    className="team-link"
                    type="button"
                    onClick={() => {
                      setActiveFilter(team.name as Team);
                      setSearch("");
                      goTo("updates");
                    }}
                  >
                    Explore team stories <ArrowUpRight size={17} />
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="updates-section section-wrap" id="updates">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-line" />
                FRESH FROM THE FAN HUB
              </div>
              <h2>
                The <span className="gradient-text">latest.</span>
              </h2>
              <p className="section-description">
                Team features, volleyball explainers, and
                community stories—all in one place.
              </p>
            </div>

            <span className="editorial-label">
              <ShieldCheck size={16} />
              FAN EDITORIAL
            </span>
          </div>

          {searchOpen && (
            <div className="search-panel">
              <label htmlFor="story-search">
                Search stories
              </label>
              <div className="search-input-wrap">
                <Search size={19} aria-hidden="true" />
                <input
                  id="story-search"
                  type="search"
                  placeholder="Search teams, topics, or stories..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  autoFocus
                />
                {search && (
                  <button
                    type="button"
                    className="clear-search"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                  >
                    <X size={17} />
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="filter-bar" aria-label="Filter stories by team">
            <div className="filter-list">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={`filter-chip ${
                    activeFilter === filter ? "active" : ""
                  }`}
                  aria-pressed={activeFilter === filter}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>

            <span className="result-count" aria-live="polite">
              {filteredStories.length}{" "}
              {filteredStories.length === 1 ? "story" : "stories"}
            </span>
          </div>

          <div className="story-grid">
            {filteredStories.map((story) => (
              <article className="story-card" key={story.id}>
                <div className={`story-visual ${story.style}`}>
                  <span className="story-category">
                    {story.category}
                  </span>
                  <Volleyball
                    className="story-ball"
                    size={story.featured ? 90 : 70}
                    strokeWidth={0.85}
                    aria-hidden="true"
                  />
                  <span className="story-team">
                    {story.team === "Community"
                      ? "REBISCOmmunity"
                      : story.team.toUpperCase()}
                  </span>
                </div>

                <div className="story-copy">
                  <span className="story-meta">
                    {story.readTime}
                  </span>
                  <h3>{story.title}</h3>
                  <p>{story.description}</p>

                  {expandedStory === story.id && (
                    <div className="story-extra">
                      <p>
                        This is a starter feature for the
                        REBISCOmmunity website. Replace this
                        sample with a fully researched article,
                        verified facts, publication date, and
                        credited media before publishing it as
                        a real news report.
                      </p>
                    </div>
                  )}

                  <button
                    className="text-link"
                    type="button"
                    aria-expanded={expandedStory === story.id}
                    onClick={() =>
                      setExpandedStory((current) =>
                        current === story.id ? null : story.id
                      )
                    }
                  >
                    {expandedStory === story.id
                      ? "Show less"
                      : "Read feature"}
                    {expandedStory === story.id ? (
                      <ChevronDown className="chevron-up" size={17} />
                    ) : (
                      <ArrowRight size={17} />
                    )}
                  </button>
                </div>
              </article>
            ))}
          </div>

          {filteredStories.length === 0 && (
            <div className="empty-state">
              <Search size={32} />
              <h3>No stories found.</h3>
              <p>
                Try a different keyword or select another team.
              </p>
              <button
                type="button"
                className="button button-outline"
                onClick={resetFilters}
              >
                Reset filters
              </button>
            </div>
          )}

          <p className="content-notice">
            <ShieldCheck size={16} />
            Sample editorial content is used in this starter.
            No live news feed is connected yet.
          </p>
        </section>

        <section className="match-section" id="matches">
          <div className="section-wrap match-layout">
            <div className="match-copy">
              <div className="eyebrow">
                <span className="eyebrow-line" />
                YOUR COURTSIDE COMPANION
              </div>
              <h2>
                Every match.
                <br />
                Every moment.
                <br />
                <span className="gradient-text">Together.</span>
              </h2>
              <p>
                Find upcoming fixtures, follow the action, and
                celebrate the final score. We're building a
                dedicated match center for all three teams.
              </p>
              <a
                className="button button-primary"
                href="https://www.pvl.ph/schedule"
                target="_blank"
                rel="noreferrer"
              >
                Check official PVL schedule
                <ArrowUpRight size={17} />
              </a>
              <p className="external-note">
                Opens the official PVL website. Check the
                relevant competition for Criss Cross fixtures.
              </p>
            </div>

            <div className="match-placeholder">
              <div className="match-placeholder-icon">
                <CalendarDays size={29} />
              </div>
              <span className="eyebrow">MATCH CENTER</span>
              <h3>The next chapter starts here.</h3>
              <p>
                Official fixture data has not been connected.
                Check the league's published schedule for
                confirmed dates and times.
              </p>
              <div className="match-status">
                <span className="status-dot" />
                AWAITING VERIFIED FIXTURES
              </div>
            </div>
          </div>
        </section>

        <section className="community-section section-wrap" id="community">
          <div className="community-card">
            <div className="community-decoration" aria-hidden="true">
              <Volleyball size={185} strokeWidth={0.6} />
            </div>

            <div className="community-copy">
              <div className="eyebrow">
                <span className="eyebrow-line" />
                YOUR VOICE MATTERS
              </div>
              <h2>
                This is your
                <br />
                <span className="gradient-text">community.</span>
              </h2>
              <p>
                Every fan has a story. Tell us which team
                you're cheering for and help shape our fan hub.
              </p>
              <div className="community-promise">
                <Users size={18} />
                A place for all three teams.
              </div>
            </div>

            <div className="poll-card">
              <div className="poll-header">
                <span className="poll-tag">FAN ROLL CALL</span>
                <span className="poll-number">01 / 01</span>
              </div>

              <h3>Who's got your heart?</h3>
              <p className="poll-description">
                Choose your team to join our on-page demo poll.
              </p>

              {voteSubmitted ? (
                <div className="poll-success" role="status">
                  <span className="success-icon">
                    <Check size={23} />
                  </span>
                  <h4>You're part of the fam!</h4>
                  <p>
                    You selected {vote}. Thanks for joining
                    the REBISCOmmunity roll call.
                  </p>
                  <p className="poll-footnote">
                    Demo only: your selection isn't stored
                    or counted on a server.
                  </p>
                  <button
                    type="button"
                    className="text-link"
                    onClick={() => {
                      setVote(null);
                      setVoteSubmitted(false);
                    }}
                  >
                    Change selection <ArrowRight size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="poll-options">
                    {teams.map((team) => (
                      <button
                        type="button"
                        key={team.name}
                        className={`poll-option ${
                          vote === team.name ? "selected" : ""
                        }`}
                        aria-pressed={vote === team.name}
                        onClick={() => setVote(team.name as Team)}
                      >
                        <span className={`poll-dot ${team.accent}`} />
                        <span>
                          <strong>{team.name}</strong>
                          <small>{team.nickname}</small>
                        </span>
                        <span className="poll-radio">
                          {vote === team.name && <Check size={13} />}
                        </span>
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="button button-primary poll-submit"
                    disabled={!vote}
                    onClick={submitPoll}
                  >
                    Count me in <ArrowRight size={17} />
                  </button>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="closing-strip">
          <div className="section-wrap closing-inner">
            <Trophy size={22} />
            <p>
              GOOD GAMES. BIG HEARTS. <strong>ONE REBISCOmmunity.</strong>
            </p>
            <button
              type="button"
              className="closing-link"
              onClick={() => goTo("home")}
            >
              Back to top <ArrowUpRight size={15} />
            </button>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="section-wrap footer-main">
          <div className="footer-brand">
            <a className="brand" href="#home">
              <span className="brand-mark" aria-hidden="true">
                <Volleyball size={25} />
              </span>
              <span className="brand-word">
                REBISCO<span>mmunity</span>
                <small>THE VOLLEYBALL FAN HUB</small>
              </span>
            </a>
            <p>
              Built by fans, for fans. Celebrating the game
              and the people who make it special.
            </p>
          </div>

          <div className="footer-column">
            <h3>Explore</h3>
            <a href="#updates">Latest stories</a>
            <a href="#teams">Our teams</a>
            <a href="#matches">Match center</a>
          </div>

          <div className="footer-column">
            <h3>Community</h3>
            <a href="#community">Fan roll call</a>
            <a href="#updates">Volleyball 101</a>
            <a href="#home">About the fan hub</a>
          </div>

          <div className="footer-column">
            <h3>Official sources</h3>
            <a
              href="https://www.pvl.ph/"
              target="_blank"
              rel="noreferrer"
            >
              PVL website <ArrowUpRight size={13} />
            </a>
            <a
              href="https://www.rebisco.com.ph/"
              target="_blank"
              rel="noreferrer"
            >
              Rebisco website <ArrowUpRight size={13} />
            </a>
          </div>
        </div>

        <div className="section-wrap footer-bottom">
          <span>
            © {new Date().getFullYear()} REBISCOmmunity.
            Built with love for volleyball.
          </span>
          <span className="independent-note">
            Independent fan project. Not officially affiliated
            with Rebisco, the teams, or their leagues.
          </span>
        </div>
      </footer>
    </>
  );
}

export default App;
