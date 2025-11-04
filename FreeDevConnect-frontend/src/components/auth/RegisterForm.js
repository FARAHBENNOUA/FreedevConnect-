import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.js';
import { useNotification } from '../../contexts/NotificationContext.js';
import Button from '../common/Button.js';
import '../../styles/components/forms.css';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'client',
    phoneNumber: ''
  });

  const [loading, setLoading] = useState(false);
  const { register, error, clearError, user, isAuthenticated, isInitializing } = useAuth();
  const { addNotification } = useNotification();

  // 🔥 Nettoyage forcé au chargement de la page
  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  const handleRoleSelect = (role) => {
    setFormData(prev => ({ ...prev, role }));
  };

  const redirectByRole = useCallback((role) => {
    const map = {
      admin: '/admin/dashboard',
      client: '/client/dashboard',
      freedev: '/freelance/dashboard',
      freelance: '/freelance/dashboard'
    };
    navigate(map[role] || '/', { replace: true });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 14) {
      addNotification('Le mot de passe doit contenir au moins 14 caractères', 'error');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      addNotification('Les mots de passe ne correspondent pas', 'error');
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...registerData } = formData;
      const success = await register(registerData);
      if (success && user) {
        addNotification('Inscription réussie !', 'success');
        redirectByRole(user.role);
      } else {
        addNotification('Échec de l\'inscription', 'error');
      }
    } catch (err) {
      addNotification('Erreur serveur', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Redirection automatique uniquement si déjà connecté
  useEffect(() => {
    if (!isInitializing && isAuthenticated && user) {
      redirectByRole(user.role);
    }
  }, [isInitializing, isAuthenticated, user, redirectByRole]);

  return (
    <div className="form-container">
      <h2>Créer un compte</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">Prénom</label>
            <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Nom</label>
            <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">Adresse email</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required minLength="14" />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
          <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">Téléphone (optionnel)</label>
          <input type="text" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Vous êtes :</label>
          <div className="role-selector">
            <div className={`role-option ${formData.role === 'client' ? 'active' : ''}`} onClick={() => handleRoleSelect('client')}>
              <span className="role-title">Client</span>
              <p>Je souhaite publier des projets</p>
            </div>
            <div className={`role-option ${formData.role === 'freedev' ? 'active' : ''}`} onClick={() => handleRoleSelect('freedev')}>
              <span className="role-title">FreeDev</span>
              <p>Je souhaite proposer mes services</p>
            </div>
          </div>
        </div>

        <div className="form-group form-checkbox">
          <input type="checkbox" id="terms" required />
          <label htmlFor="terms">
            J'accepte les <Link to="/conditions-utilisation">conditions d'utilisation</Link> et 
            les <Link to="/mentions-legales">mentions légales</Link>
          </label>
        </div>

        <Button type="submit" variant="primary" block disabled={loading}>
          {loading ? '⏳ Inscription...' : '🚀 Créer mon compte'}
        </Button>
      </form>

      <div className="form-footer">
        <p>Déjà un compte ? <Link to="/login">Se connecter</Link></p>
      </div>
    </div>
  );
};

export default RegisterForm;
     