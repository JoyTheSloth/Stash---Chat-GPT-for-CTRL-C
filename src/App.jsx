import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CursorGrid from './CursorGrid';
import OptionWheel from './OptionWheel';
import stashLogo from '../assets/stash-logo.png';
import stashDashboard from '../assets/stash-dashboard.png';
import st1 from '../assets/st1.png';
import st2 from '../assets/st2.png';
import st3 from '../assets/st3.png';
import st4 from '../assets/st4.png';
import st5 from '../assets/st5.png';
import frame1 from '../assets/Frame 1.png';
import imagePng from '../assets/image.png';
import LineSidebar from './LineSidebar.jsx';

const DOWNLOAD_LINK = "https://www.mediafire.com/file/e06u2jw15gqwau6/Stash_Setup_1.0.0.exe/file";
const GITHUB_REPO_LINK = "https://github.com/JoyTheSloth/Stash-/tree/main";

const viewModesData = [
  {
    id: 'list',
    title: 'List Mode',
    badge: 'Detailed & Compact',
    tag: 'Line-by-Line Feed',
    icon: '☰',
    img: st2,
    desc: 'Clean, line-by-line feed for reading code, commands, and notes with zero clutter.'
  },
  {
    id: 'grid2x2',
    title: '2x2 Grid Mode',
    badge: 'Balanced Overview',
    tag: '2x2 Grid Layout',
    icon: '⊞',
    img: imagePng,
    desc: 'Spacious 2x2 grid balancing deep clip previews with rapid visual scanning.'
  },
  {
    id: 'grid3x3',
    title: '3x3 Grid Mode',
    badge: 'High Density Discovery',
    tag: '3x3 Gallery View',
    icon: '❖',
    img: st3,
    desc: 'High-density 3x3 grid to scan dozens of copied items without endless scrolling.'
  }
];

const fadeInUp = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.05
    }
  }
};

function Brand() {
  return (
    <motion.a 
      className="brand" 
      href="#top" 
      aria-label="Stash home"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
    >
      <img className="brand-mark" src={stashLogo} alt="" />
      <span>stash</span>
    </motion.a>
  );
}

function AppPreview() {
  return (
    <div className="hero-dual-stage">
      {/* CALLOUT BADGE 1: Alt + V Hotkey Pill */}
      <motion.div 
        className="hero-callout-pill pill-top neo-brutal"
        initial={{ opacity: 0, scale: 0.8, y: -10, rotate: -5 }}
        animate={{ opacity: 1, scale: 1, y: [0, -7, 0], rotate: -3 }}
        transition={{ 
          opacity: { duration: 0.5, delay: 0.4 },
          scale: { duration: 0.5, delay: 0.4 },
          y: { repeat: Infinity, duration: 4.2, ease: "easeInOut" }
        }}
        whileHover={{ scale: 1.08, rotate: 0, y: -4 }}
      >
        <span className="pill-badge pill-pink">HOTKEY RECALL</span>
        <div className="pill-text">
          <strong>Press Alt + V anytime ⚡</strong>
          <small>Replaces Win + V with instant search</small>
        </div>
        <svg className="callout-arrow arrow-down" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 7l10 10M17 7v10H7" />
        </svg>
      </motion.div>

      {/* SECONDARY BACK CARD (Frame 1.png) - TILTED */}
      <motion.div 
        className="hero-card-frame card-back"
        initial={{ opacity: 0, y: 30, rotate: -7, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, rotate: -6, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        whileHover={{ rotate: -2, scale: 1.04, zIndex: 10 }}
      >
        <img 
          className="hero-card-img" 
          src={frame1} 
          alt="Stash feature preview card"
        />
      </motion.div>

      {/* PRIMARY FRONT CARD (st3.png) - SMALLER & TILTED */}
      <motion.div 
        className="hero-card-frame card-front"
        initial={{ opacity: 0, y: 25, rotate: 5, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, rotate: 4, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
        whileHover={{ rotate: 1, scale: 1.04, zIndex: 10 }}
      >
        <img 
          className="hero-card-img" 
          src={st3} 
          alt="Stash 3x3 grid mode dashboard preview"
        />
      </motion.div>

      {/* CALLOUT BADGE 2: Local & AI Mode Pill */}
      <motion.div 
        className="hero-callout-pill pill-bottom neo-brutal"
        initial={{ opacity: 0, scale: 0.8, y: 10, rotate: 4 }}
        animate={{ opacity: 1, scale: 1, y: [0, 7, 0], rotate: 2 }}
        transition={{ 
          opacity: { duration: 0.5, delay: 0.6 },
          scale: { duration: 0.5, delay: 0.6 },
          y: { repeat: Infinity, duration: 4.8, ease: "easeInOut" }
        }}
        whileHover={{ scale: 1.08, rotate: 0, y: -4 }}
      >
        <svg className="callout-arrow arrow-up" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 17L7 7M7 17V7h10" />
        </svg>
        <div className="pill-text">
          <strong>Local Mode &amp; AI Mode 🧠</strong>
          <small>Toggle instant local or smart AI recall</small>
        </div>
        <span className="pill-badge pill-lavender">DUAL ENGINE</span>
      </motion.div>
    </div>
  );
}

export default function App() {
  const [activeViewIdx, setActiveViewIdx] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { label: 'Home', target: '#top', icon: 'home' },
    { label: 'View Modes', target: '#view-modes', icon: 'eye' },
    { label: 'Stash Pad & It', target: '#stash-pad-section', icon: 'spark' },
    { label: 'Why Stash', target: '#why-title', icon: 'spark' },
    { label: 'Features', target: '#features', icon: 'grid' },
    { label: 'Workflow', target: '#workflow', icon: 'flow' },
    { label: 'Privacy', target: '#privacy', icon: 'lock' },
    { label: 'Get Stash', target: '#download', icon: 'download' }
  ];

  const navigateToSection = (_, item) => 
    document.querySelector(item.target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className="site-shell">
      <LineSidebar items={navigationItems} onItemClick={navigateToSection} />
      
      <motion.header 
        className="nav wrap"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Brand />
        <nav className="nav-links" aria-label="Main navigation">
          <a href="#view-modes">View Modes</a>
          <a href="#features">Features</a>
          <a href="#workflow">Workflow</a>
          <a href="#privacy">Privacy</a>
        </nav>
        
        <div className="nav-right-actions">
          <motion.a 
            className="nav-github-link" 
            href={GITHUB_REPO_LINK}
            target="_blank"
            rel="noopener noreferrer"
            title="View GitHub Repository"
            aria-label="GitHub Repository"
            whileHover={{ scale: 1.08, translateY: -2 }}
            whileTap={{ scale: 0.94 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
          </motion.a>

          <motion.a 
            className="nav-cta" 
            href={DOWNLOAD_LINK}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04, translateY: -2 }}
            whileTap={{ scale: 0.96 }}
          >
            Get Stash <span>↗</span>
          </motion.a>

          <button 
            className="mobile-menu-toggle" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile navigation menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              className="mobile-menu-drawer"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <a href="#view-modes" onClick={() => setMobileMenuOpen(false)}>View Modes</a>
              <a href="#stash-pad-section" onClick={() => setMobileMenuOpen(false)}>Stash Pad &amp; Stash It</a>
              <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#workflow" onClick={() => setMobileMenuOpen(false)}>Workflow</a>
              <a href="#privacy" onClick={() => setMobileMenuOpen(false)}>Privacy</a>
              <a href={GITHUB_REPO_LINK} target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)}>GitHub Repository ↗</a>
              <a 
                href={DOWNLOAD_LINK} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mobile-drawer-cta" 
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Stash ↗
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <main id="top">
        {/* HERO SECTION */}
        <section className="hero wrap">
          <motion.div 
            className="hero-copy"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.p className="eyebrow" variants={fadeInUp}>
              <span className="pulse" /> Built for developers, not Windows defaults
            </motion.p>
            <motion.h1 variants={fadeInUp}>
              Your ChatGPT<br />for <em>Ctrl + C.</em>
            </motion.h1>
            <motion.p className="hero-text" variants={fadeInUp}>
              Stash turns every copied thought, command, key, and code snippet into a private, searchable memory vault — right on your machine with both <b>Local Mode</b> and <b>AI Mode</b>.
            </motion.p>
            <motion.div className="hero-actions" variants={fadeInUp}>
              <motion.a 
                className="button primary" 
                href={DOWNLOAD_LINK}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, translateY: -3 }}
                whileTap={{ scale: 0.96 }}
              >
                Get Stash for Windows <span>↓</span>
              </motion.a>
              <motion.a 
                className="button text-button" 
                href="#features"
                whileHover={{ translateX: 5 }}
                whileTap={{ scale: 0.96 }}
              >
                See how it works <span>→</span>
              </motion.a>
            </motion.div>
            <motion.div className="hero-proof" variants={fadeInUp}>
              <span className="hero-quote">“Built for devs who live in their terminal.”</span>
            </motion.div>
          </motion.div>

          <div className="product-stage">
            <div className="halo" />
            <AppPreview />
          </div>
        </section>

        {/* CREATED WITH LOVE & CAFFEINE (CENTERED ABOVE TICKER) */}
        <div style={{ textAlign: 'center', margin: '0 0 24px 0', position: 'relative', zIndex: 2 }}>
          <span style={{ color: '#a695c7', fontSize: '13.5px', fontFamily: '"DM Mono", monospace', letterSpacing: '0.2px' }}>
            Created with love &amp; caffeine by <strong style={{ color: '#f0e6ff' }}>Joydeep Das</strong>
          </span>
        </div>

        {/* TICKER */}
        <section className="ticker" aria-label="Key features marquee">
          <div className="ticker-track">
            {/* First Set */}
            <span>ALT + V GLOBAL HOTKEY</span><i>✦</i>
            <span>LOCAL MODE &amp; AI MODE</span><i>✦</i>
            <span>AI PDF &amp; TXT EXPORT</span><i>✦</i>
            <span>OPENAI · GEMINI · GROQ · MISTRAL</span><i>✦</i>
            <span>PRIVATE BY DEFAULT</span><i>✦</i>
            <span>SEMANTIC SEARCH</span><i>✦</i>
            <span>ZERO CLOUD SYNC</span><i>✦</i>
            <span>LOCAL SQLITE VAULT</span><i>✦</i>
            <span>NO TELEMETRY</span><i>✦</i>
            <span>INSTANT RECALL</span><i>✦</i>

            {/* Duplicate Set for Seamless Loop */}
            <span>ALT + V GLOBAL HOTKEY</span><i>✦</i>
            <span>LOCAL MODE &amp; AI MODE</span><i>✦</i>
            <span>AI PDF &amp; TXT EXPORT</span><i>✦</i>
            <span>OPENAI · GEMINI · GROQ · MISTRAL</span><i>✦</i>
            <span>PRIVATE BY DEFAULT</span><i>✦</i>
            <span>SEMANTIC SEARCH</span><i>✦</i>
            <span>ZERO CLOUD SYNC</span><i>✦</i>
            <span>LOCAL SQLITE VAULT</span><i>✦</i>
            <span>NO TELEMETRY</span><i>✦</i>
            <span>INSTANT RECALL</span><i>✦</i>
          </div>
        </section>

        {/* VIEW MODES SECTION (CENTERED & COMPACT) */}
        <motion.section 
          className="view-modes-section wrap" 
          id="view-modes"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer}
        >
          <motion.div className="view-modes-header" variants={fadeInUp}>
            <p className="eyebrow"><span className="pulse" /> Win + V could never</p>
            <h2>View modes Windows + V<br />can't give you.</h2>
            <p>
              Standard Windows clipboard history (Win + V) forces everything into a cluttered single column. 
              Stash unlocks 3 tailored display modes so you can scan and read clips your way.
            </p>
          </motion.div>

          <motion.div className="view-mode-tabs" variants={fadeInUp}>
            {viewModesData.map((mode, idx) => (
              <button
                key={mode.id}
                className={`view-tab-btn ${activeViewIdx === idx ? 'active' : ''}`}
                onClick={() => setActiveViewIdx(idx)}
              >
                <span>{mode.icon}</span>
                {mode.title}
              </button>
            ))}
          </motion.div>

          <motion.div className="view-stage-showcase" variants={fadeInUp}>
            <div className="view-stage-image-container">
              <AnimatePresence mode="wait">
                <motion.img
                  key={viewModesData[activeViewIdx].id}
                  className="view-stage-image"
                  src={viewModesData[activeViewIdx].img}
                  alt={viewModesData[activeViewIdx].title}
                  initial={{ opacity: 0, scale: 0.97, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                />
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div className="view-modes-cards-grid" variants={staggerContainer}>
            {viewModesData.map((mode, idx) => (
              <motion.div
                key={mode.id}
                className={`view-card ${activeViewIdx === idx ? 'is-active' : ''}`}
                variants={fadeInUp}
                onClick={() => setActiveViewIdx(idx)}
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="view-card-badge">{mode.badge}</span>
                <h3>{mode.title}</h3>
                <p>{mode.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* STASH PAD & STASH IT SECTION */}
        <motion.section 
          className="stash-pad-section wrap" 
          id="stash-pad-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer}
        >
          <motion.div className="stash-pad-intro" variants={fadeInUp}>
            <p className="eyebrow"><span className="pulse" /> Copy first, figure it out later</p>
            <h2>Capture once. Auto-archive.<br />Paste multiple at once.</h2>
            <p>
              Stash eliminates accidental clipboard losses with an intelligent scratchpad buffer and unlocks multi-clip batch pasting that standard Windows clipboard tools can't touch.
            </p>
          </motion.div>

          <div className="stash-dual-showcase">
            {/* STASH PAD CARD */}
            <motion.div className="stash-dual-card" variants={fadeInUp}>
              <div className="stash-card-header">
                <span className="stash-card-badge">✦ STASH PAD</span>
                <h3>Universal Auto-Categorizing Scratchpad</h3>
                <p>
                  Drop text, code, URLs, or notes into <b>Stash Pad</b>. Stash auto-categorizes and archives them into your permanent library after 1–2 hours.
                </p>
                <div className="stash-feature-tags">
                  <span className="stash-tag">⏱ 1-2h Auto Archive</span>
                  <span className="stash-tag">🏷 Auto-Categorization</span>
                  <span className="stash-tag">🧠 Smart Recognition</span>
                </div>
              </div>
              <div className="stash-card-image-frame">
                <img className="stash-card-image" src={st4} alt="Stash Pad auto-categorizing scratchpad" />
              </div>
            </motion.div>

            {/* STASH IT CARD */}
            <motion.div className="stash-dual-card" variants={fadeInUp}>
              <div className="stash-card-header">
                <span className="stash-card-badge">⚡ STASH IT</span>
                <h3>Multi-Clip Batch Paste</h3>
                <p>
                  Select multiple copied clips from your memory feed simultaneously and paste them all together in a single keystroke directly into your IDE or terminal.
                </p>
                <div className="stash-feature-tags">
                  <span className="stash-tag">⊞ Multi-Select</span>
                  <span className="stash-tag">⚡ One-Key Batch Paste</span>
                  <span className="stash-tag">⌘ Batch Clipboard</span>
                </div>
              </div>
              <div className="stash-card-image-frame">
                <img className="stash-card-image" src={st5} alt="Stash It multi-clip batch paste feature" />
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* WHY STASH */}
        <motion.section 
          className="why-stash wrap" 
          aria-labelledby="why-title"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.div className="why-heading" variants={fadeInUp}>
            <p className="eyebrow"><span className="pulse" /> Why your current setup sucks</p>
            <h2 id="why-title">A smarter place for<br />everything you copy.</h2>
          </motion.div>

          <motion.div className="proof-grid" variants={staggerContainer}>
            <motion.article variants={fadeInUp} whileHover={{ y: -8, scale: 1.01 }}>
              <span className="proof-number">01</span>
              <div className="proof-icon">⌂</div>
              <h3>100% local &amp; private</h3>
              <p>Your clips stay 100% on your machine — zero cloud sync, accounts, or telemetry.</p>
            </motion.article>

            <motion.article variants={fadeInUp} whileHover={{ y: -8, scale: 1.01 }}>
              <span className="proof-number">02</span>
              <div className="proof-icon">✦</div>
              <h3>Local Mode &amp; AI Mode</h3>
              <p>Switch instantly between lightning-fast Local Mode and smart AI natural language recall.</p>
            </motion.article>

            <motion.article variants={fadeInUp} whileHover={{ y: -8, scale: 1.01 }}>
              <span className="proof-number">03</span>
              <div className="proof-icon">⌘</div>
              <h3>Global Alt + V Hotkey</h3>
              <p>Summon Stash anywhere on Windows with Alt + V to inspect, search, and paste clips instantly.</p>
            </motion.article>
          </motion.div>
        </motion.section>

        {/* FEATURES */}
        <motion.section 
          className="features wrap" 
          id="features"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer}
        >
          <motion.div className="section-intro centered-intro" variants={fadeInUp}>
            <p className="eyebrow"><span className="pulse" /> Built offline. Configured for control.</p>
            <h2>Power features for<br />your daily workflow.</h2>
            <p className="section-quote centered-quote">
              “100% local operation with full control over memory retention, search engines, and exports.”
            </p>
          </motion.div>

          <motion.div className="feature-grid" variants={staggerContainer}>
            {/* CARD 1: LOCAL MODE & AI MODE */}
            <motion.article className="feature-card large" variants={fadeInUp} whileHover={{ y: -8, scale: 1.01 }}>
              <div className="card-top-bar">
                <div className="feature-icon violet">✦</div>
                <p className="card-kicker">01 / DUAL ENGINE</p>
              </div>
              <h3>Dual Search:<br />Local Mode &amp; AI Mode</h3>
              <p>Search your clipboard instantly. Toggle <b>Local Mode</b> for exact keyword matches or <b>AI Mode</b> for semantic natural language queries.</p>
              <div className="search-demo">
                <span>✦</span><span>where is my postgres connection?</span><kbd>LOCAL &amp; AI MODE</kbd>
              </div>
              <div className="tags" style={{ marginTop: '14px' }}>
                <span className="active-tag">⚡ Local Mode</span><span>🧠 AI Mode</span><span>100% Private</span><span>Natural Language</span>
              </div>
            </motion.article>

            {/* CARD 2: MEMORY CONTROL & SETTINGS */}
            <motion.article className="feature-card" variants={fadeInUp} whileHover={{ y: -8, scale: 1.01 }}>
              <div className="card-top-bar">
                <div className="feature-icon pink">⚙</div>
                <p className="card-kicker">02 / MEMORY CONTROL</p>
              </div>
              <h3>Retention &amp;<br />Instant Purge</h3>
              <p>Control memory retention (3 Days, 7 Days, or Forever). Purge your vault anytime in 1 click.</p>
              <div className="tags" style={{ marginTop: '20px' }}>
                <span>3 Days</span><span>7 Days</span><span>Forever</span><span className="nuke-tag">⚡ 1-Click Clear</span>
              </div>
            </motion.article>

            {/* CARD 3: SMART EXPORT & AI PDF */}
            <motion.article className="feature-card" variants={fadeInUp} whileHover={{ y: -8, scale: 1.01 }}>
              <div className="card-top-bar">
                <div className="feature-icon blue">📄</div>
                <p className="card-kicker">03 / SMART EXPORT &amp; AI</p>
              </div>
              <h3>Instant TXT &amp;<br />AI PDF Export</h3>
              <p>Export clipboard history to clean TXT or AI-summarized PDF reports via <b>OpenAI, Gemini, Groq, or Mistral</b>.</p>
              <div className="tags" style={{ marginTop: '20px' }}>
                <span className="active-tag">📄 TXT &amp; PDF Active</span><span>🤖 OpenAI / Gemini</span><span>⚡ Groq / Mistral</span>
              </div>
            </motion.article>
          </motion.div>
        </motion.section>

        {/* WORKFLOW */}
        <motion.section 
          className="workflow" 
          id="workflow"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
        >
          <div className="workflow-image" />
          <div className="workflow-copy wrap">
            <div className="workflow-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1.1fr) minmax(300px, 0.9fr)', gap: '40px', alignItems: 'center', position: 'relative', zIndex: 2 }}>
              <motion.div className="workflow-panel" variants={staggerContainer}>
                <motion.p className="eyebrow" variants={fadeInUp}><span className="pulse" /> Spin the wheel of clipboard sanity</motion.p>
                <motion.h2 variants={fadeInUp}>Copy. Forget.<br /><em>Recall with Alt + V.</em></motion.h2>
                <motion.p variants={fadeInUp}>Stash captures your clipboard automatically, understands what it is, and keeps it ready for exactly the right moment.</motion.p>
                <motion.div className="steps" variants={staggerContainer}>
                  <motion.div variants={fadeInUp} whileHover={{ x: 8 }}>
                    <span>01</span>
                    <p><b>Copy anything</b><small>Code, credentials, commands, notes.</small></p>
                  </motion.div>
                  <motion.div variants={fadeInUp} whileHover={{ x: 8 }}>
                    <span>02</span>
                    <p><b>Stash makes sense of it</b><small>Local &amp; AI modes title and categorize it locally.</small></p>
                  </motion.div>
                  <motion.div variants={fadeInUp} whileHover={{ x: 8 }}>
                    <span>03</span>
                    <p><b>Press Alt + V to recall</b><small>Instant hotkey brings it right back.</small></p>
                  </motion.div>
                </motion.div>
              </motion.div>

              <motion.div 
                className="workflow-wheel-container"
                variants={fadeInUp}
                style={{ height: '460px', width: '100%', position: 'relative', overflow: 'hidden' }}
              >
                <OptionWheel
                  items={[
                    'Alt + V Hotkey ⚡',
                    'Local & AI Modes 🧠',
                    'AI PDF & TXT Export 📄',
                    'OpenAI · Gemini · Groq · Mistral 🤖',
                    '100% Local Vault ⌂',
                    'Multi-Clip Merge ⊞',
                    'Code & Key Recognition ⚙',
                    'Zero Account Needed 🔒',
                    'AES-256 Encrypted 🛡'
                  ]}
                  defaultSelected={1}
                  textColor="#8878a6"
                  activeColor="#f0d5ff"
                  side="right"
                  fontSize={2.1}
                  spacing={1.35}
                  curve={1.1}
                  tilt={7}
                  blur={1.8}
                  fade={0.28}
                  smoothing={200}
                  inset={20}
                  loop={true}
                  draggable={true}
                />
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* PRIVACY */}
        <motion.section 
          className="privacy wrap" 
          id="privacy"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
        >
          <motion.div className="privacy-card" whileHover={{ translateY: -4 }}>
            <div>
              <p className="eyebrow"><span className="pulse" /> Zero telemetry, zero cloud BS</p>
              <h2>A vault, not<br />a surveillance tool.</h2>
              <p>Everything lives locally on your device. No accounts. No cloud. No one looking over your shoulder.</p>
              <motion.a 
                href="#download" 
                className="button ghost"
                whileHover={{ scale: 1.04, translateY: -2 }}
                whileTap={{ scale: 0.96 }}
              >
                Explore privacy <span>→</span>
              </motion.a>
            </div>
            
            {/* Sleek Vault Security Widget */}
            <div className="vault-security-widget">
              <div className="vault-status-header">
                <span className="status-indicator-dot" />
                <strong>LOCAL VAULT ENCRYPTED</strong>
                <small className="status-pill">100% OFFLINE</small>
              </div>

              <div className="vault-meter-box">
                <div className="vault-meter-row">
                  <span>AES-256 Storage</span>
                  <strong>LOCAL SQLITE</strong>
                </div>
                <div className="vault-meter-bar">
                  <div className="vault-meter-fill" />
                </div>
                <div className="vault-meter-sub">
                  <span>Outbound Connections</span>
                  <strong className="zero-outbound">0 KB (BLOCKED)</strong>
                </div>
              </div>

              <div className="vault-badges-grid">
                <div className="vault-badge-item">
                  <span>🛡️</span> <strong>AES-256 DB</strong>
                </div>
                <div className="vault-badge-item">
                  <span>🚫</span> <strong>Zero Analytics</strong>
                </div>
                <div className="vault-badge-item">
                  <span>⚡</span> <strong>Local SQLite</strong>
                </div>
                <div className="vault-badge-item">
                  <span>🔑</span> <strong>No Account</strong>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* DOWNLOAD */}
        <motion.section 
          className="download" 
          id="download"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={staggerContainer}
          style={{ position: 'relative', overflow: 'hidden', width: '100%', padding: '115px 0 122px' }}
        >
          <CursorGrid
            cellSize={56}
            color="#E056FD"
            radius={190}
            falloff="smooth"
            holdTime={350}
            fadeDuration={700}
            lineWidth={1.5}
            maxOpacity={1}
            fillOpacity={0}
            gridOpacity={0.03}
            cellRadius={4}
            clickPulse={true}
            pulseSpeed={750}
          />
          <div className="wrap" style={{ position: 'relative', zIndex: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <motion.p className="eyebrow" variants={fadeInUp} style={{ justifyContent: 'center' }}>
              <span className="pulse" /> Windows Executable Ready
            </motion.p>
            <motion.h2 variants={fadeInUp}>
              Stop losing<br />your best <em>copies.</em>
            </motion.h2>
            <motion.p variants={fadeInUp} style={{ maxWidth: '560px', margin: '0 auto 16px', color: '#bfaedc', fontSize: '15px', lineHeight: '1.6' }}>
              Summon Stash anywhere with <kbd className="hotkey-pill">Alt + V</kbd>. Runs 100% locally with dual <b>Local Mode</b> &amp; <b>AI Mode</b>. Built by Joydeep Das.
            </motion.p>

            <motion.div className="download-specs-bar" variants={fadeInUp}>
              <div className="spec-item">
                <span className="spec-label">Installer File</span>
                <span className="spec-val">Stash_Setup_1.0.0.exe</span>
              </div>
              <div className="spec-divider" />
              <div className="spec-item">
                <span className="spec-label">Global Hotkey</span>
                <span className="spec-val">Alt + V</span>
              </div>
              <div className="spec-divider" />
              <div className="spec-item">
                <span className="spec-label">Search Engines</span>
                <span className="spec-val">Local &amp; AI</span>
              </div>
              <div className="spec-divider" />
              <div className="spec-item">
                <span className="spec-label">Platform</span>
                <span className="spec-val">Windows 10 / 11</span>
              </div>
            </motion.div>

            <motion.a 
              className="button primary large-button" 
              href={DOWNLOAD_LINK}
              target="_blank"
              rel="noopener noreferrer"
              variants={fadeInUp}
              whileHover={{ scale: 1.06, translateY: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              Download Stash v1.0.0 (.exe) <span>↓</span>
            </motion.a>
            
            <motion.div className="download-meta-info" variants={fadeInUp}>
              <span>Direct MediaFire Download</span> · <span>100% Offline Vault</span> · <span>No Account Required</span>
            </motion.div>
          </div>
        </motion.section>
      </main>

      {/* RICH ENHANCED FOOTER */}
      <footer className="enhanced-footer">
        <div className="footer-top wrap centered-footer">
          <div className="footer-brand-col">
            <Brand />
            <p className="footer-tagline">Your ChatGPT for <em>Ctrl + C.</em></p>
          </div>
        </div>

        <div className="footer-divider wrap" />

        <div className="footer-bottom wrap">
          <p>© 2026 Stash Memory Engine · Created with love &amp; caffeine by <strong>Joydeep Das</strong></p>
          <div className="footer-links">
            <a href="https://joydeepdas-portfolio.vercel.app/" target="_blank" rel="noreferrer">Portfolio</a>
            <a href="https://www.linkedin.com/in/joydeep-das-78123522a" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href={GITHUB_REPO_LINK} target="_blank" rel="noreferrer">GitHub Repo</a>
            <span className="version">v1.0.0 (Windows)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

