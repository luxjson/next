'use client';

import { useState, useEffect, useRef } from 'react';
import useExternalStyle from '../../hooks/useExternalStyle';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import emailjs from '@emailjs/browser';
const brFlag = '/assets/images/br.svg';
const ukFlag = '/assets/images/uk.svg';

export default function BlogPost() {
  useExternalStyle('blog.css');
  const { slug } = useParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('pt');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [status, setStatus] = useState('');
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
      backToBlog: 'Voltar ao Blog',
      notFound: 'Post não encontrado.',
      errorLoading: 'Erro ao carregar o post.',
      footerSub: 'SUA VISÃO CONSTRÓI NOSSA HISTÓRIA',
      headerBlog: 'BLOG',
      headerWork: 'TRABALHO',
      headerChat: 'FALE COMIGO',
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
      readingTime: 'min de leitura',
      views: 'visualizações',
    },
    en: {
      backToBlog: 'Back to Blog',
      notFound: 'Post not found.',
      errorLoading: 'Error loading post.',
      footerSub: 'YOUR VISION BUILDS OUR HISTORY',
      headerBlog: 'BLOG',
      headerWork: 'WORK',
      headerChat: "LET'S CHAT",
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
      readingTime: 'min read',
      views: 'views',
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
    const fetchPost = async () => {
      try {
        const api = axios.create({
          baseURL: '/api',
        });
        const res = await api.get(`/blog/posts/${slug}`);
        setPost(res.data.post);
      } catch (err) {
        console.error('Erro ao buscar post:', err);
        setError(t('notFound'));
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

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

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const calculateReadingTime = (content) => {
    if (!content) return 1;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / 200);
  };

  if (loading) {
    return (
      <div className="sohub-root">
        <div className="sh-loading">Carregando...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="sohub-root">
        <div className="sh-hero" style={{ minHeight: '60vh' }}>
          <div className="sh-hero-container">
            <div className="sh-hero-text">
              <h1 className="sh-giant-title" style={{ fontSize: 'clamp(60px, 10vw, 120px)' }}>
                {renderMixedText('404')}
              </h1>
              <p className="sh-hero-sub" style={{ fontSize: 'clamp(18px, 2.5vw, 32px)' }}>
                {error || t('notFound')}
              </p>
              <button
                onClick={() => router.push('/blog')}
                className="sh-chat-btn"
                style={{ marginTop: '40px', border: 'none', cursor: 'pointer' }}
              >
                <span>{t('backToBlog')}</span>
                <div className="sh-circle-icon"><i className="material-icons">arrow_back</i></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const readingTime = calculateReadingTime(post.content);

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
              router.push('/');
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
                router.push('/');
              }}
              role="button"
              tabIndex={0}
              style={{ cursor: 'pointer' }}
            >
              {t('headerWork')}
            </a>
            <a
              onClick={(e) => {
                e.preventDefault();
                router.push('/blog');
              }}
              role="button"
              tabIndex={0}
              style={{ cursor: 'pointer' }}
            >
              {t('headerBlog')}
            </a>
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

      <main className="sh-blog-post-main">
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="sh-blog-post-article"
        >
          <h1 className="sh-blog-post-title">{post.title}</h1>

          <div className="sh-blog-post-meta">
            <span className="sh-blog-post-meta-item">
              <i className="material-icons">calendar_today</i>
              {formatDate(post.published_at || post.created_at)}
            </span>
            <span className="sh-blog-post-meta-item">
              <i className="material-icons">schedule</i>
              {readingTime} {t('readingTime')}
            </span>
            {post.views > 0 && (
              <span className="sh-blog-post-meta-item">
                <i className="material-icons">visibility</i>
                {post.views} {t('views')}
              </span>
            )}
          </div>

          {post.cover_image && (
            <div className="sh-blog-post-cover">
              <img
                src={post.cover_image}
                alt={post.title}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          <div
            className="sh-blog-post-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="sh-blog-post-footer">
            <button
              onClick={() => router.push('/blog')}
              className="sh-blog-post-back-btn"
            >
              <i className="material-icons">arrow_back</i>
              {t('backToBlog')}
            </button>
          </div>
        </motion.article>
      </main>

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
                              <label className="" htmlFor="name">{t('chatName')}</label>
                              <input type="text" id="name" name="user_name" placeholder={language === 'pt' ? 'Seu nome' : 'Your name'} required />
                            </div>
                            <div className="sh-input-group">
                              <label className="" htmlFor="email">{t('chatEmail')}</label>
                              <input type="email" id="email" name="user_email" placeholder="your@email.com" required />
                            </div>
                            <div className="sh-input-group">
                              <label className="" htmlFor="subject">{t('chatSubject')}</label>
                              <input type="text" id="subject" name="subject" placeholder={language === 'pt' ? 'Sobre o que é?' : 'What is this about?'} required />
                            </div>
                            <div className="sh-input-group">
                              <label className="" htmlFor="message">{t('chatMessage')}</label>
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
    </div>
  );
}