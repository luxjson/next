'use client';

import { useState, useEffect, useRef } from 'react';
import useExternalStyle from '../../hooks/useExternalStyle';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
const brFlag = '/assets/images/br.svg';
const ukFlag = '/assets/images/uk.svg';
import Link from 'next/link';
import axios from 'axios';

export default function Blog() {
  useExternalStyle('blog.css');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('pt');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [user, setUser] = useState(null);
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

  useEffect(() => {
      const fetchData = async () => {
        try {
          const [userRes] = await Promise.all([
            fetch('https://api.github.com/users/luxjson'),
            fetch('https://api.github.com/users/luxjson/repos?per_page=100&sort=pushed')
          ]);
          const userData = await userRes.json();
          setUser(userData);
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


  const translations = {
    pt: {
      heroTitle: 'BLOG',
      heroSub: 'FIQUE POR DENTRO DAS NOVIDADES E ARTIGOS',
      noPosts: 'Nenhum post publicado ainda.',
      readMore: 'Ler mais',
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
      headerChat: 'FALE COMIGO',
      headerBlog: 'BLOG',
      headerWork: 'TRABALHO',
    },
    en: {
      heroTitle: 'BLOG',
      heroSub: 'STAY UPDATED WITH NEWS AND ARTICLES',
      noPosts: 'No posts published yet.',
      readMore: 'Read more',
      chatTitle: 'GET IN TOUCH',
      chatName: 'NAME',
      chatEmail: 'EMAIL',
      chatSubject: 'SUBJECT',
      chatMessage: 'MESSAGE',
      footerSub: 'YOUR VISION BUILDS OUR HISTORY',
      chatSend: 'SEND MESSAGE',
      chatSending: 'SENDING...',
      chatSent: 'SENT SUCCESSFULLY.',
      chatError: 'ERROR. TRY AGAIN.',
      infoTitle: 'INFO',
      infoMade: 'Made by',
      infoRepo: 'View repository',
      headerChat: "LET'S CHAT",
      headerBlog: 'BLOG',
      headerWork: 'WORK',
    },
  };

  const t = (key) => translations[language]?.[key] || key;

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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const api = axios.create({
          baseURL: '/api',
        });
        const res = await api.get('/blog/posts?limit=10&publishedOnly=true');
        setPosts(res.data.posts || []);
      } catch (error) {
        console.error('Erro ao buscar posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

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
  const renderMixedText = (text) => {
    if (!text) return '';
    const parts = text.toUpperCase().split(/(\d+)/);
    return parts.map((part, i) =>
      /\d+/.test(part) ? <span key={i} className="fix">{part}</span> : part
    );
  };

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
          <Link href="/" className="sh-logo-nav">
            LUXJSON
          </Link>
      
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
              <div className="sh-circle-icon"><i className="material-icons">mail</i></div>
            </button>
          </div>
        </div>
      </header>

      <main id="main-content">
        <section className="sh-hero" style={{ minHeight: '60vh' }}>
          <div className="sh-hero-container">
            <div className="sh-hero-text">
              <motion.h1
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="sh-giant-title-1"
                style={{ fontSize: 'clamp(80px, 15vw, 250px)' }}
              >
                {renderMixedText(t('heroTitle'))}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="sh-hero-sub fix"
              >
                {t('heroSub')}
              </motion.p>
            </div>
            <div className="sh-hero-render">
              <span className="material-icons sh-float-icon">article</span>
            </div>
          </div>
        </section>
        <section className="sh-work">
          <div className="sh-container">
            <span className="sh-section-tag fix">{t('heroSub')}</span>
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
              ) : posts.length === 0 ? (
                <div className="sh-empty-state">
                  <i className="material-icons">inbox</i>
                  <p>{t('noPosts')}</p>
                </div>
              ) : (
                posts.map((post, i) => (
                  <motion.div
                    key={`${post.id || post.slug || 'post'}-${i}`}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    className="sh-project-card"
                    style={{ cursor: 'pointer' }}
                    onClick={() => window.location.href = `/blog/${post.slug}`}
                  >
                    <div className="sh-project-card-inner">
                      <div
                        className="sh-project-card-image"
                        style={{
                          backgroundImage: `url(${post.cover_image || 'https://via.placeholder.com/800x400/1e232c/8896a8?text=No+Image'})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      >
                        <div className="sh-project-card-overlay">
                          <div className="sh-project-card-hint">
                            <i className="material-icons">visibility</i>
                            <span>{language === 'pt' ? 'Clique para ler' : 'Click to read'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="sh-project-card-content">
                        <div className="sh-project-card-header">
                          <h3 className="sh-project-card-title">
                            {post.title}
                          </h3>
                          <span className="sh-project-card-lang" style={{
                            backgroundColor: 'var(--sohub-success)',
                            color: '#fff'
                          }}>
                            {new Date(post.published_at || post.created_at).toLocaleDateString('pt-BR', { 
                              day: '2-digit', 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </span>
                        </div>
                        {post.excerpt && (
                          <p className="sh-project-card-desc">
                            {post.excerpt.length > 80 
                              ? post.excerpt.slice(0, 80) + '...' 
                              : post.excerpt}
                          </p>
                        )}
                        <div className="sh-project-card-meta">
                          {post.views > 0 && (
                            <span><i className="material-icons">visibility</i> {post.views}</span>
                          )}
                          <span><i className="material-icons">schedule</i> {new Date(post.created_at).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
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
      </AnimatePresence>
    </div>
  );
}