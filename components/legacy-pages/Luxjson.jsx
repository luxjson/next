'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
const brFlag = '/assets/images/br.svg';
const ukFlag = '/assets/images/uk.svg';
import Link from 'next/link';
const svgLogo = '/assets/images/logo.svg';
export default function Luxjson() {
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('pt');
  const [selectedProject, setSelectedProject] = useState(null);
  const form = useRef();

  useEffect(() => {
    const storedTheme = window.localStorage.getItem('lux-theme');
    const storedLanguage = window.localStorage.getItem('lux-language');
    if (storedTheme) setTheme(storedTheme);
    if (storedLanguage) setLanguage(storedLanguage);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('lux-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('lux-language', language);
  }, [language]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  const toggleLanguage = () => setLanguage(prev => (prev === 'pt' ? 'en' : 'pt'));

  const translations = {
    pt: {
      heroTitle: 'SUA VISÃO CONSTRÓI NOSSA HISTÓRIA.',
      workTag: 'TRABALHO',
      workDesc: 'SOU UM <span class="sh-h-word">DESENVOLVEDOR WEB JÚNIOR</span>, APAIXONADO POR TRANSFORMAR IDEIAS EM REALIDADE.',
      aboutTitle: 'DESENVOLVIMENTO INTELIGENTE',
      aboutDesc: 'Especializado em construir sistemas de alto desempenho e experiências digitais que superam expectativas.',
      footerSub: 'SUA VISÃO CONSTRÓI NOSSA HISTÓRIA',
      chatTitle: 'ENTRE EM CONTATO',
      chatName: 'NOME',
      chatEmail: 'EMAIL',
      chatSubject: 'ASSUNTO',
      chatMessage: 'MENSAGEM',
      chatSend: 'ENVIAR MENSAGEM',
      chatSending: 'ENVIANDO...',
      chatSent: 'ENVIADO COM SUCESSO.',
      chatError: 'ERRO. TENTE NOVAMENTE.',
      infoTitle: 'INFORMAÇÕES',
      infoMade: 'Feito por',
      infoRepo: 'Ver repositório',
      modalClose: 'Fechar',
      modalNoDesc: 'Sem descrição disponível no GitHub.',
      modalStars: 'Estrelas',
      modalForks: 'Forks',
      modalIssues: 'Issues',
      modalUpdated: 'Atualizado',
      modalViewGit: 'Ver no GitHub',
      modalAccess: 'Acessar Projeto',
      modalDemo: 'Acessar Demo',
      modalRepo: 'Ver Repositório',
      modalTopics: 'Tópicos',
      noProjects: 'Nenhum projeto encontrado.',
      headerWork: 'TRABALHO',
      headerAbout: 'SOBRE',
      headerContact: 'CONTATO',
      headerChat: 'FALE COMIGO',
      headerBlog: 'BLOG',
      deadsmileTitle: 'DEADSMILE',
      deadsmileSlogan: 'Create worlds. Explore beyond.',
      deadsmileDesc: 'Estúdio de desenvolvimento de jogos indie focado em criar mundos imersivos e experiências marcantes para os jogadores.',
      deadsmileBtn: 'Ver Organização',
    },
    en: {
      heroTitle: 'YOUR VISION BUILDS OUR HISTORY.',
      workTag: 'WORK',
      workDesc: 'I AM A JUNIOR <span class="sh-h-word">WEB DEVELOPER</span>, PASSIONATE ABOUT TURNING IDEAS INTO REALITIES.',
      aboutTitle: 'SMART DEVELOPMENT',
      aboutDesc: 'Specialized in Building High-Performance Systems and Digital Experiences That Surpass Expectations.',
      footerSub: 'YOUR VISION BUILDS OUR HISTORY',
      chatTitle: 'GET IN TOUCH',
      chatName: 'NAME',
      chatEmail: 'EMAIL',
      chatSubject: 'SUBJECT',
      chatMessage: 'MESSAGE',
      chatSend: 'SEND MESSAGE',
      chatSending: 'SENDING...',
      chatSent: 'SENT SUCCESSFULLY.',
      chatError: 'ERROR. TRY AGAIN.',
      infoTitle: 'INFO',
      infoMade: 'Made by',
      infoRepo: 'View repository',
      modalClose: 'Close',
      modalNoDesc: 'No description available on GitHub.',
      modalStars: 'Stars',
      modalForks: 'Forks',
      modalIssues: 'Issues',
      modalUpdated: 'Updated',
      modalViewGit: 'View on GitHub',
      modalAccess: 'Access Project',
      modalDemo: 'View Demo',
      modalRepo: 'View Repository',
      modalTopics: 'Topics',
      noProjects: 'No projects found.',
      headerWork: 'WORK',
      headerAbout: 'ABOUT',
      headerContact: 'CONTACT',
      headerChat: "LET'S CHAT",
      headerBlog: 'BLOG',
      deadsmileTitle: 'DEADSMILE',
      deadsmileSlogan: 'Create worlds. Explore beyond.',
      deadsmileDesc: 'Indie game development studio focused on building immersive worlds and memorable experiences for players.',
      deadsmileBtn: 'View Organization',
    },
  };

  const t = (key) => translations[language]?.[key] || key;

  useEffect(() => {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    const moveCursor = (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    const handleMouseOver = (e) => {
      const target = e.target.closest('a, button, .sh-project-card, .sh-social-link, .card, [role="button"]');
      if (target) {
        cursor.classList.add('active');
      } else {
        cursor.classList.remove('active');
      }
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleMouseOver);
      if (document.body.contains(cursor)) document.body.removeChild(cursor);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch('https://api.github.com/users/luxjson'),
          fetch('https://api.github.com/users/luxjson/repos?per_page=100&sort=pushed')
        ]);
        const userData = await userRes.json();
        const reposData = await reposRes.json();
        setUser(userData);

        const targets = ['analisai-express', 'react', 'light', 'insomnia', 'SENAI-MaryCario'];
        const blacklist = ['lightoldwebsite'];
        const filtered = reposData.filter(repo =>
          targets.some(t => repo.name.toLowerCase().includes(t)) &&
          !blacklist.some(b => repo.name.toLowerCase() === b)
        );
        setProjects(filtered);
      } catch (error) {
        console.error('Erro ao buscar dados do GitHub:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const sendEmail = (e) => {
    e.preventDefault();
    setStatus(t('chatSending'));
    emailjs
      .sendForm('service_2agyezv', 'template_keoux04', form.current, '-7mi-fOFqFgasG8qS')
      .then(() => {
        setStatus(t('chatSent'));
        setTimeout(() => {
          setIsChatOpen(false);
          setStatus('');
          form.current.reset();
        }, 2000);
      })
      .catch(() => {
        setStatus(t('chatError'));
        setTimeout(() => setStatus(''), 3000);
      });
  };

  const renderMixedText = (text) => {
    if (!text) return '';
    const parts = text.toUpperCase().split(/(\d+)/);
    return parts.map((part, i) =>
      /\d+/.test(part) ? <span key={i} className="fix">{part}</span> : part
    );
  };

  const [isLoading, setIsLoading] = useState(true);
const [progress, setProgress] = useState(0);

useEffect(() => {
  let interval;
  let timeout;

  if (!loading) {
    setProgress(100);
    timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return;
  }

  interval = setInterval(() => {
    setProgress(prev => {
      if (prev >= 95) {
        clearInterval(interval);
        return 95;
      }
      return prev + Math.random() * 8 + 2;
    });
  }, 150);

  timeout = setTimeout(() => {
    setIsLoading(false);
    clearInterval(interval);
  }, 3000);

  return () => {
    clearInterval(interval);
    clearTimeout(timeout);
  };
}, [loading]);

  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: '#f1e05a',
      TypeScript: '#3178c6',
      Python: '#3572A5',
      HTML: '#e34c26',
      CSS: '#563d7c',
      Java: '#b07219',
      C: '#555555',
      'C++': '#f34b7d',
      'C#': '#178600',
      Ruby: '#701516',
      PHP: '#4F5D95',
      Go: '#00ADD8',
      Rust: '#dea584',
      Swift: '#ffac45',
      Kotlin: '#A97BFF',
      Dart: '#00B4AB',
      Vue: '#41b883',
      React: '#61dafb',
      Angular: '#dd0031',
      Node: '#68a063',
      Express: '#000000',
      MongoDB: '#47A248',
      PostgreSQL: '#336791',
      MySQL: '#4479A1',
      Firebase: '#FFCA28',
      Docker: '#2496ED',
      Kubernetes: '#326CE5',
      AWS: '#FF9900',
      Azure: '#0078D4',
      GCP: '#4285F4',
    };
    return colors[language] || '#6c757d';
  };

  const openProjectModal = (repo) => setSelectedProject(repo);
  const closeProjectModal = () => setSelectedProject(null);

  return (
    <div className="sohub-root selection:bg-black selection:text-white">
      <div className="sh-float-buttons">
        <motion.button
          className="sh-theme-toggle"
          onClick={toggleTheme}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Alternar tema"
        >
          <AnimatePresence mode="wait">
            <motion.i
              key={theme}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              className="material-icons"
            >
              {theme === 'light' ? 'dark_mode' : 'light_mode'}
            </motion.i>
          </AnimatePresence>
        </motion.button>

        <motion.button
          className="sh-lang-toggle"
          onClick={toggleLanguage}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Alternar idioma"
        >
          <img
            src={language === 'pt' ? brFlag : ukFlag}
            alt={language === 'pt' ? 'Português' : 'English'}
            className="sh-lang-flag-img"
          />
        </motion.button>
      </div>

      <header className="sh-header">
  <div className="sh-nav-pill">
    <a
      onClick={(e) => {
        e.preventDefault();
        document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
      }}
      className="sh-logo-nav"
      role="button"
      tabIndex={0}
      style={{ cursor: 'pointer' }}
    >
      LUXJSON
    </a>

    <div className="sh-nav-links">
      <a
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
        }}
        role="button"
        tabIndex={0}
        style={{ cursor: 'pointer' }}
      >
        {t('headerWork')}
      </a>

        <Link href="/blog">{t('headerBlog')}</Link>

      <button
        onClick={() => setIsChatOpen(true)}
        className="sh-chat-btn"
        style={{ border: 'none', cursor: 'pointer' }}
        aria-label="Abrir chat"
      >
        <span>{t('headerChat')}</span>
        <div className="sh-circle-icon sh-circle-icon-chat"><i className="material-icons">mail</i></div>
      </button>
    </div>
  </div>
</header>

      <main id="main-content">
        <section id="home" className="sh-hero">
          <div className="sh-hero-container">
            <div className="sh-hero-text">
              <motion.h1
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="sh-giant-title"
              >
                {renderMixedText('LUXJSON')}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="sh-hero-sub fix"
                dangerouslySetInnerHTML={{ __html: t('heroTitle') }}
              />
            </div>
            <div className="sh-hero-render">
              <span className="material-icons sh-float-icon">polymer</span>
            </div>
          </div>
        </section>

        

        <section id="work" className="sh-work">
          <div className="sh-container">
            <span className="sh-section-tag fix">{t('workTag')}</span>
            <h2
              className="sh-description-text"
              dangerouslySetInnerHTML={{ __html: t('workDesc') }}
            />

            <div className="sh-projects-grid">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="sh-project-skeleton">
                    <div className="sh-skeleton-image"></div>
                    <div className="sh-skeleton-content">
                      <div className="sh-skeleton-title"></div>
                      <div className="sh-skeleton-desc"></div>
                      <div className="sh-skeleton-tags"></div>
                    </div>
                  </div>
                ))
              ) : projects.length === 0 ? (
                <div className="sh-empty-state">
                  <i className="material-icons">inbox</i>
                  <p>{t('noProjects')}</p>
                </div>
              ) : (
                projects.map((repo, i) => (
                  <motion.div
                    key={`${repo.id || repo.name || 'repo'}-${i}`}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    className="sh-project-card"
                    onClick={() => openProjectModal(repo)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="sh-project-card-inner">
                      <div
                        className="sh-project-card-image"
                        style={{
                          backgroundImage: `url(https://opengraph.githubassets.com/1/luxjson/${repo.name})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      >
                        <div className="sh-project-card-overlay">
                          <div className="sh-project-card-hint">
                            <i className="material-icons">visibility</i>
                            <span>{language === 'pt' ? 'Clique para ver detalhes' : 'Click to see details'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="sh-project-card-content">
                        <div className="sh-project-card-header">
                          <h3 className="sh-project-card-title">
                            {renderMixedText(repo.name.replace(/-/g, ' '))}
                          </h3>
                          {repo.language && (
                            <span className="sh-project-card-lang" style={{
                              backgroundColor: getLanguageColor(repo.language)
                            }}>
                              {repo.language}
                            </span>
                          )}
                        </div>
                        {repo.description && (
                          <p className="sh-project-card-desc">
                            {repo.description.length > 60
                              ? repo.description.slice(0, 60) + '...'
                              : repo.description}
                          </p>
                        )}
                        <div className="sh-project-card-meta">
                          {repo.stargazers_count > 0 && (
                            <span><i className="material-icons">star</i> {repo.stargazers_count}</span>
                          )}
                          {repo.forks_count > 0 && (
                            <span><i className="material-icons">fork_right</i> {repo.forks_count}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </section>

        <section id="deadsmile" className="sh-services fundo-escuro" style={{ paddingTop: '0px' }}>
          <div className="sh-container">
            <div 
              className="sh-service-card deadsmile-card" 
              style={{ background: '#ff0000', color: '#ffd900' }}
            >
              <div className="deadsmile-content">
                <h2 className="sh-service-title" style={{ fontSize: 'clamp(40px, 6vw, 100px)' }}>
                  {t('deadsmileTitle')}
                </h2>
                <p className="fix" style={{ color: '#ffd900', fontSize: 'clamp(16px, 2vw, 24px)', marginTop: '15px', letterSpacing: '1px' }}>
                  {t('deadsmileSlogan')}
                </p>
                <p className="sh-service-desc" style={{ color: '#ffd900' }}>
                  {t('deadsmileDesc')}
                </p>
                <div style={{ marginTop: '40px' }}>
                  <a
                    href="https://github.com/teamdeadsmile"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sh-modal-btn-primary"
                    style={{ background: '#ffd900', color: '#ff0000' }}
                  >
                    <i className="fab fa-github"></i> {t('deadsmileBtn')}
                  </a>
                </div>
              </div>

              <div className="deadsmile-logo-container">
                <img 
                  src={svgLogo} 
                  alt="DEADSMILE Logo" 
                  className="deadsmile-logo-img"
                />
              </div>
            </div>
          </div>
        </section>


        <section id="about" className="sh-services fundo-escuro">
          <div className="sh-container">
            <div className="sh-service-card">
              <h2 className="sh-service-title">
                {t('aboutTitle').split(' ')[0]} <br />
                <span className="text-grey span">{t('aboutTitle').split(' ').slice(1).join(' ')}</span>
              </h2>
              <p className="sh-service-desc">{t('aboutDesc')}</p>
              {user && (
                <div style={{ marginTop: '40px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <img src={user.avatar_url} alt="Avatar" style={{ width: '60px', borderRadius: '50%' }} />
                  <div>
                    <p style={{ fontSize: '18px' }}>{user.name || user.login}</p>
                    <p style={{ color: 'var(--sohub-grey)', fontSize: '14px' }}>{user.bio}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="sh-footer">
        <div className="sh-footer-bg-text">{renderMixedText('LUXJSON')}</div>
        <div className="sh-footer-main fundo-escuro">
          <h2 className="sh-footer-title">© LUXJSON</h2>
          <span className="sh-footer-sub fix">{t('footerSub')}</span>
          <div className="sh-footer-socials">
            <a href="https://github.com/luxjson" target="_blank" rel="noopener noreferrer" className="sh-social-link" aria-label="GitHub">
              <i className="fab fa-github"></i>
            </a>
            <a href="https://instagram.com/luxjson" target="_blank" rel="noopener noreferrer" className="sh-social-link" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://linkedin.com/in/luxjson" target="_blank" rel="noopener noreferrer" className="sh-social-link" aria-label="LinkedIn">
              <i className="fab fa-linkedin"></i>
            </a>
            <button onClick={() => setIsInfoOpen(true)} className="sh-social-link" style={{ border: 'none', cursor: 'pointer' }} aria-label="Abrir informações">
              <i className="material-icons">info</i>
            </button>
          </div>
          {user && (
            <div style={{ fontFamily: 'monospace', marginTop: '20px', color: 'var(--sohub-grey)', fontSize: '12px' }}>
              <i className="fab fa-github" style={{ marginRight: '5px' }} /> · {user.public_repos} repositorys · {user.followers} followers
            </div>
          )}
        </div>
      </footer>

      <AnimatePresence>
        {isChatOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsChatOpen(false)}
              className="sh-modal-overlay"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="sh-chat-modal"
            >
              <div className="sh-modal-header">
                <h2>{t('chatTitle')}</h2>
                <button onClick={() => setIsChatOpen(false)} className="sh-close-btn" aria-label="Fechar">
                  <i className="material-icons">close</i>
                </button>
              </div>

              <form ref={form} onSubmit={sendEmail} className="sh-modal-form">
                <div className="sh-input-group">
                  <label className="fix" htmlFor="name">{t('chatName')}</label>
                  <input type="text" id="name" name="user_name" placeholder={language === 'pt' ? 'Seu nome' : 'Your name'} required />
                </div>
                <div className="sh-input-group">
                  <label className="fix" htmlFor="email">{t('chatEmail')}</label>
                  <input type="email" id="email" name="user_email" placeholder="your@email.com" required />
                </div>
                <div className="sh-input-group">
                  <label className="fix" htmlFor="subject">{t('chatSubject')}</label>
                  <input type="text" id="subject" name="subject" placeholder={language === 'pt' ? 'Sobre o que é?' : 'What is this about?'} required />
                </div>
                <div className="sh-input-group">
                  <label className="fix" htmlFor="message">{t('chatMessage')}</label>
                  <textarea id="message" name="message" placeholder={language === 'pt' ? 'Sua mensagem...' : 'Your message...'} rows="5" required />
                </div>

                <div className="sh-modal-footer">
                  <button type="submit" className="sh-submit-pill" disabled={status === t('chatSending')}>
                    <span>{status || t('chatSend')}</span>
                    <div className="sh-circle-icon">
                      {status === t('chatSending') ? (
                        <i className="material-icons" style={{ animation: 'spin 1s linear infinite' }}>sync</i>
                      ) : (
                        <i className="material-icons">arrow_forward</i>
                      )}
                    </div>
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isInfoOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInfoOpen(false)}
              className="sh-modal-overlay"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="sh-info-drawer-simple"
            >
              <div className="sh-info-drawer-header">
                <h2>{t('infoTitle')}</h2>
                <button onClick={() => setIsInfoOpen(false)} className="sh-close-btn" aria-label="Fechar">
                  <i className="material-icons">close</i>
                </button>
              </div>
              <div className="sh-info-drawer-body-simple">
                {user && (
                  <img src={user.avatar_url} alt="Avatar" style={{ width: '80px', borderRadius: '50%', marginBottom: '10px' }} />
                )}
                <div className="sh-simple-version">
                  <span className="sh-simple-badge">v1.7</span>
                </div>
                <div className="sh-simple-heart">
                  {t('infoMade')} {user?.name || user?.login || 'luxjson'}
                </div>
              </div>
              <div className="sh-drawer-buttons">
                <a
                  href="https://github.com/luxjson/luxjson.github.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sh-drawer-btn"
                >
                  <i className="fab fa-github"></i> {t('infoRepo')}
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeProjectModal}
            className="sh-project-modal-overlay"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="sh-project-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={closeProjectModal} className="sh-project-modal-close" aria-label={t('modalClose')}>
                <i className="material-icons">close</i>
              </button>

              <div className="sh-project-modal-body">
                <div className="sh-project-modal-image">
                  <img
                    src={`https://opengraph.githubassets.com/1/luxjson/${selectedProject.name}`}
                    alt={selectedProject.name}
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"%3E%3Crect width="400" height="250" fill="%231e232c"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="18" fill="%238896a8" text-anchor="middle" dy=".3em"%3ENo preview available%3C/text%3E%3C/svg%3E';
                      e.target.style.objectFit = 'contain';
                    }}
                  />
                </div>

                <div className="sh-project-modal-details">
                  <div className="sh-project-modal-header-info">
                    <h2>{renderMixedText(selectedProject.name.replace(/-/g, ' '))}</h2>
                    {selectedProject.language && (
                      <span className="sh-project-language-badge" style={{ backgroundColor: getLanguageColor(selectedProject.language) }}>
                        {selectedProject.language}
                      </span>
                    )}
                  </div>

                  {selectedProject.description ? (
                    <p>{selectedProject.description}</p>
                  ) : (
                    <p className="sh-modal-fallback">
                      <i className="material-icons">info</i> {t('modalNoDesc')}
                    </p>
                  )}

                  <div className="sh-project-modal-stats">
                    {selectedProject.stargazers_count > 0 && (
                      <span><i className="material-icons">star</i> {selectedProject.stargazers_count} <small>{t('modalStars')}</small></span>
                    )}
                    {selectedProject.forks_count > 0 && (
                      <span><i className="material-icons">fork_right</i> {selectedProject.forks_count} <small>{t('modalForks')}</small></span>
                    )}
                    {selectedProject.open_issues_count > 0 && (
                      <span><i className="material-icons">bug_report</i> {selectedProject.open_issues_count} <small>{t('modalIssues')}</small></span>
                    )}
                    <span><i className="material-icons">update</i> {new Date(selectedProject.updated_at).toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US')} <small>{t('modalUpdated')}</small></span>
                  </div>

                  <div className="sh-project-modal-footer">
                    {selectedProject.name.toLowerCase() === 'insomnia' ? (
                      <Link href="/insomnia" className="sh-modal-btn-primary">
                        <i className="material-icons">open_in_browser</i> {t('modalAccess')}
                      </Link>
                    ) : (
                      <a href={selectedProject.html_url} target="_blank" rel="noopener noreferrer" className="sh-modal-btn-primary">
                        <i className="material-icons">open_in_new</i> {t('modalViewGit')}
                      </a>
                    )}
                    <a 
                      href={`https://DEADSML.itch.io/${selectedProject.name}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="sh-modal-btn-secondary"
                    >
                      <i className="material-icons">link</i> {selectedProject.html_url ? t('modalDemo') : t('modalRepo')}
                    </a>
                  </div>

                  {selectedProject.topics && selectedProject.topics.length > 0 && (
                    <div className="sh-project-modal-topics">
                      <span className="sh-modal-topics-label">{t('modalTopics')}:</span>
                      {selectedProject.topics.map((topic, i) => (
                        <span key={i} className="sh-modal-topic">#{topic}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
  {isLoading && (
    <motion.div
      className="sh-boot-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="sh-boot-content"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="sh-boot-logo">LUXJSON</h1>
      </motion.div>
    </motion.div>
  )}
  <motion.a key="api-float-btn"
        href="https://luxjson.vercel.app/" //href="https://api.luxjson-is-a.dev"
        rel="noopener noreferrer"
        className="sh-api-float-btn"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="View API"
      >
        <span className="sh-api-text">API</span>
        <div className="sh-circle-icon sh-api-icon-wrap">
          <i className="material-icons">arrow_forward</i>
        </div>
      </motion.a>
</AnimatePresence>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}