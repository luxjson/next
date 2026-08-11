'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { motion } from 'framer-motion';
import useExternalStyle from '../../../hooks/useExternalStyle';

export default function AdminLayout({ children }) {
  useExternalStyle('admin.css');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { admin, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

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

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navItems = [
    { path: '/admin', icon: 'dashboard', label: 'Dashboard' },
    { path: '/admin/posts', icon: 'article', label: 'Posts' },
    { path: '/admin/posts/new', icon: 'add_circle', label: 'Novo Post' },
  ];

  const getPageTitle = () => {
    if (pathname === '/admin') return 'Dashboard';
    if (pathname === '/admin/posts') return 'Posts';
    if (pathname === '/admin/posts/new') return 'Novo Post';
    if (pathname.startsWith('/admin/posts/edit')) return 'Editar Post';
    return 'Painel';
  };

  return (
    <div className="sh-admin-layout">
      <aside className={`sh-admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sh-admin-sidebar-header">
          <h2>{sidebarOpen && 'LUXJSON'}</h2>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="sh-sidebar-toggle" aria-label="Menu">
            <i className="material-icons">{sidebarOpen ? 'chevron_left' : 'chevron_right'}</i>
          </button>
        </div>
        <nav className="sh-admin-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`sh-admin-nav-link ${pathname === item.path ? 'active' : ''}`}
            >
              <i className="material-icons">{item.icon}</i>
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
          <button onClick={handleLogout} className="sh-mobile-logout" aria-label="Sair">
            <i className="fa-solid fa-right-from-bracket"></i>
          </button>
        </nav>
        <div className="sh-admin-sidebar-footer">
          <div className="sh-admin-user">
            {sidebarOpen && <span>{admin?.username || 'Admin'}</span>}
            <button onClick={handleLogout} className="sh-admin-logout" aria-label="Sair">
              <i className="fa-solid fa-right-from-bracket"></i>
            </button>
          </div>
        </div>
      </aside>

      <motion.main
        className="sh-admin-main"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="sh-admin-topbar">
          <h1>{getPageTitle()}</h1>
        </div>
        <div className="sh-admin-content">
          {children}
        </div>
      </motion.main>
    </div>
  );
}