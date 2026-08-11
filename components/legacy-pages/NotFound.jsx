'use client';

import { useState, useEffect } from 'react';
import useExternalStyle from '../../hooks/useExternalStyle';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  useExternalStyle('blog.css');
  const router = useRouter();
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const storedTheme = window.localStorage.getItem('lux-theme');
    if (storedTheme) setTheme(storedTheme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('lux-theme', theme);
  }, [theme]);

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
    <div className="sohub-root selection:bg-black selection:text-white" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <main style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="sh-hero" style={{ minHeight: 'auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="sh-hero-container" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <div className="sh-hero-text" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <h1 className="sh-giant-title" style={{ fontSize: 'clamp(60px, 15vw, 150px)', textAlign: 'center' }}>
                {renderMixedText('404')}
              </h1>
              <p className="sh-hero-sub" style={{ fontSize: 'clamp(18px, 3vw, 36px)', textAlign: 'center' }}>
                Page Not Found
              </p>
              <button
                onClick={() => router.push('/')}
                className="sh-chat-btn"
                style={{ marginTop: '40px', border: 'none', cursor: 'pointer' }}
              >
                <span>Back to Home</span>
                <div className="sh-circle-icon"><i className="material-icons">arrow_back</i></div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}