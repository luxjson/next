'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { motion } from 'framer-motion';

export default function PostForm() {
  const { id } = useParams();
  const router = useRouter();
  const { api } = useAuth();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    cover_image: '',
    published: true,
  });
  const [error, setError] = useState('');

  const isEditing = !!id;

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
    if (isEditing) {
      loadPost();
    }
  }, [id]);

  const loadPost = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/blog/posts/id/${id}`);
      const post = res.data.post;
      setFormData({
        title: post.title || '',
        content: post.content || '',
        excerpt: post.excerpt || '',
        cover_image: post.cover_image || '',
        published: post.published ?? true,
      });
    } catch (error) {
      console.error('Erro ao carregar post:', error);
      setError('Não foi possível carregar o post para edição.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const endpoint = isEditing ? `/blog/posts/${id}` : '/blog/posts';
      const method = isEditing ? 'put' : 'post';
      const response = await api[method](endpoint, formData);
      if (response.data.success) {
        router.push('/admin/posts');
      } else {
        setError(response.data.message || 'Erro ao salvar post.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar post.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  if (loading) {
    return <div className="sh-loading">Carregando post...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sh-form-container"
    >
      <h2 className="sh-form-title">{isEditing ? 'Editar Post' : 'Novo Post'}</h2>
      {error && <div className="sh-form-error">{error}</div>}
      <form onSubmit={handleSubmit} className="sh-form">
        <div className="sh-input-group">
          <label className="fix" htmlFor="title">
            TÍTULO
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Digite o título"
            required
          />
        </div>
        <div className="sh-input-group">
          <label className="fix" htmlFor="excerpt">
            RESUMO
          </label>
          <input
            type="text"
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            placeholder="Breve resumo do post"
          />
        </div>
        <div className="sh-input-group">
          <label className="fix" htmlFor="cover_image">
            URL DA IMAGEM DE CAPA
          </label>
          <input
            type="url"
            id="cover_image"
            name="cover_image"
            value={formData.cover_image}
            onChange={handleChange}
            placeholder="https://exemplo.com/imagem.jpg"
          />
        </div>
        <div className="sh-input-group">
          <label className="fix" htmlFor="content">
            CONTEÚDO
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="10"
            placeholder="Escreva o conteúdo do post..."
            required
          />
        </div>
        <div className="sh-form-actions">
          <button type="submit" className="sh-btn-primary" disabled={saving}>
            {saving ? 'SALVANDO...' : isEditing ? 'ATUALIZAR' : 'CRIAR'}
          </button>
          <button
            type="button"
            className="sh-btn-secondary"
            onClick={() => router.push('/admin/posts')}
          >
            CANCELAR
          </button>
        </div>
      </form>
    </motion.div>
  );
}