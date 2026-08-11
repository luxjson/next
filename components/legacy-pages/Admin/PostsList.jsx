'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PostsList() {
  const { api } = useAuth();
  const router = useRouter();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    const moveCursor = (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    const handleMouseOver = (e) => {
      const target = e.target.closest(
        'a, button, .sh-project-card, .sh-social-link, .card, [role="button"]'
      );
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
      if (document.body.contains(cursor)) {
        document.body.removeChild(cursor);
      }
    };
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/blog/posts?publishedOnly=false&limit=100');
      setPosts(res.data.posts || []);
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
      alert(error.response?.data?.message || 'Não foi possível carregar os posts.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    router.push(`/admin/posts/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este post?')) return;
    setDeleting(id);
    try {
      await api.delete(`/blog/posts/${id}`);
      setPosts((current) => current.filter((post) => post.id !== id));
    } catch (error) {
      console.error('Erro ao excluir post:', error);
      alert(error.response?.data?.message || 'Não foi possível excluir o post.');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return <div className="sh-loading">Carregando posts...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sh-list-container"
    >
      <div className="sh-list-header">
        <h2>Todos os Posts</h2>
        <Link href="/admin/posts/new" className="sh-btn-primary">
          Adicionar Novo Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="sh-empty-state">
          <i className="material-icons">article</i>
          <p>Nenhum post criado ainda.</p>
          <Link href="/admin/posts/new" className="sh-btn-primary">
            Criar Primeiro Post
          </Link>
        </div>
      ) : (
        <div className="sh-table-wrapper">
          <table className="sh-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Status</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <motion.tr
                  key={`${post.id || post.slug || 'post'}-${post.created_at || 'date'}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td>{post.title}</td>
                  <td>
                    <span className={`sh-status-badge ${post.published ? 'published' : 'draft'}`}>
                      {post.published ? 'Publicado' : 'Rascunho'}
                    </span>
                  </td>
                  <td>{new Date(post.created_at).toLocaleDateString('pt-BR')}</td>
                  <td>
                    <div className="sh-actions">
                      <button
                        onClick={() => handleEdit(post.id)}
                        className="sh-btn-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="sh-btn-sm sh-btn-danger"
                        disabled={deleting === post.id}
                      >
                        {deleting === post.id ? 'Excluindo...' : 'Excluir'}
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}