import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.js';
import { useNotification } from '../../contexts/NotificationContext.js';
import Button from '../common/Button.js';
import '../../styles/components/forms.css';

const LoginForm = () => {
  const navigate = useNavigate();
  const isSubmitting = useRef(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login, error, clearError } = useAuth();
  const { addNotification } = useNotification();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error && clearError) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting.current) {
      console.log('⚠️ Déjà en cours...');
      return;
    }

    if (formData.password.length < 14) {
      addNotification('Le mot de passe doit contenir au moins 14 caractères', 'error');
      return;
    }

    isSubmitting.current = true;
    setLoading(true);
    
    try {
      const success = await login({
        email: formData.email,
        password: formData.password
      });
      
      if (success) {
        addNotification('✅ Connexion réussie !', 'success');
        
        // ✅ Récupérer l'utilisateur
        const savedUser = localStorage.getItem('user');
        const userData = savedUser ? JSON.parse(savedUser) : null;
        
        // ✅ Redirection immédiate
        if (userData?.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else if (userData?.role === 'freedev') {
          navigate('/freelance/dashboard', { replace: true });
        } else if (userData?.role === 'client') {
          navigate('/client/dashboard', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } else {
        addNotification('❌ Email ou mot de passe incorrect', 'error');
        isSubmitting.current = false;
      }
    } catch (err) {
      console.error('❌ Erreur:', err);
      addNotification('❌ Erreur de connexion', 'error');
      isSubmitting.current = false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Connexion</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="votre@email.com"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="14"
            placeholder="Minimum 14 caractères"
            disabled={loading}
          />
          <Link to="/forgot-password" className="forgot-password">
            Mot de passe oublié ?
          </Link>
        </div>
        <Button type="submit" variant="primary" block disabled={loading}>
          {loading ? '⏳ Connexion...' : '🔐 Se connecter'}
        </Button>
      </form>
      <div className="form-footer">
        <p>Pas encore de compte ? <Link to="/register">S'inscrire</Link></p>
      </div>
    </div>
  );
};

export default LoginForm;