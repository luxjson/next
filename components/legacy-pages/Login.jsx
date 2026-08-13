'use client';

import { useEffect, useState } from 'react';
import useExternalStyle from '../../hooks/useExternalStyle';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
const svgLogo = '/assets/images/logo.svg';

export default function Login() {
  useExternalStyle('admin.css');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(username, password);
    setLoading(false);
    if (result.success) {
      router.push('/admin');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="sh-login-page">
      <div className="sh-login-wrapper">
        {/* Lado Esquerdo: Formulário */}
        <div className="sh-login-left">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="sh-login-card"
          >
            <div className="sh-login-header">
              <h1 style={{ fontSize: '4rem' }}>LUXJSON</h1>
            </div>
            <form onSubmit={handleSubmit} className="sh-login-form">
              <div className="sh-input-group">
                <label className="fix">USERNAME</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                />
              </div>
              <div className="sh-input-group">
                <label className="fix">PASSWORD</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              {error && <div className="sh-login-error">{error}</div>}
              <button type="submit" className="sh-login-btn" disabled={loading}>
                {loading ? 'ACESSING...' : 'LOGIN'}
              </button>

              <button
                type="button"
                onClick={() => router.push('/')}
                className="sh-btn-secondary"
                style={{ width: '100%', marginTop: '12px', textAlign: 'center', justifyContent: 'center' }}
              >
                BACK TO HOME
              </button>
            </form>
          </motion.div>
        </div>

        {/* Lado Direito: Imagem / Estúdio Deadsmile */}
        <div className="sh-login-right">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="sh-login-right-content"
          >
            <img src={svgLogo} alt="DEADSMILE Logo" className="sh-login-right-logo" />
            <p className="fix" style={{ color: '#ffd900', fontSize: '2rem', letterSpacing: '2px', maxWidth: '400px' }}>
              Create worlds. Explore beyond.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}