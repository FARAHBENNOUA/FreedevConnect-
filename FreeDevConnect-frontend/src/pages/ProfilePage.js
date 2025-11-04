import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import '../styles/pages/profile.css';

const ProfilePage = () => {
  const { user: contextUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(contextUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        // ✅ Essayer de charger le profil depuis l'API
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8889/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log('✅ Profil chargé depuis API:', response.data);
        setUser(response.data.user || response.data);
      } catch (error) {
        console.warn('⚠️ API non disponible, utilisation du contexte:', error.message);
        // ✅ Fallback : utiliser les données du contexte
        setUser(contextUser);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, navigate, contextUser]);

  if (loading) {
    return (
      <div className="loading">
        Chargement du profil...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="loading">
        Aucun utilisateur connecté
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* En-tête du profil */}
        <div className="profile-header">
          <div className="profile-avatar">
            {user.firstName?.[0]?.toUpperCase() || user.prenom?.[0]?.toUpperCase() || 'U'}
            {user.lastName?.[0]?.toUpperCase() || user.nom?.[0]?.toUpperCase() || ''}
          </div>
          <div className="profile-info">
            <h1>
              {user.firstName || user.prenom} {user.lastName || user.nom}
            </h1>
            <p className="profile-email">{user.email}</p>
            <span className="profile-role-badge">
              {user.role === 'admin' ? '🛠️ Admin' : 
               user.role === 'freedev' ? '💼 FreeDev' : 
               '🚀 Client'}
            </span>
          </div>
          <button 
            className="btn-edit-profile"
            onClick={() => navigate('/profile/edit')}
          >
            ✏️ Modifier le profil
          </button>
        </div>

        {/* Informations du profil */}
        <div className="profile-sections">
          {/* Informations personnelles */}
          <div className="profile-section">
            <h2>📋 Informations personnelles</h2>
            <div className="profile-details">
              <div className="detail-item">
                <span className="detail-label">Nom complet :</span>
                <span className="detail-value">
                  {user.firstName || user.prenom} {user.lastName || user.nom}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email :</span>
                <span className="detail-value">{user.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Rôle :</span>
                <span className="detail-value">
                  {user.role === 'admin' ? 'Administrateur' : 
                   user.role === 'freedev' ? 'Freelance' : 
                   'Client'}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Téléphone :</span>
                <span className="detail-value">
                  {user.phoneNumber || user.phone || 'Non renseigné'}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Ville :</span>
                <span className="detail-value">{user.city || 'Non renseignée'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Pays :</span>
                <span className="detail-value">{user.country || 'Non renseigné'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Statut :</span>
                <span className="detail-value">
                  <span style={{
                    padding: '4px 12px',
                    background: user.status === 'active' ? '#28a745' : '#6c757d',
                    color: 'white',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}>
                    {user.status === 'active' ? '✅ Actif' : '⏸️ Inactif'}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Biographie (si disponible) */}
          {user.bio && (
            <div className="profile-section">
              <h2>📝 Biographie</h2>
              <p className="profile-bio">{user.bio}</p>
            </div>
          )}

          {/* Pour les freelances */}
          {user.role === 'freedev' && (
            <>
              {(user.title || user.hourlyRate) && (
                <div className="profile-section">
                  <h2>💼 Informations professionnelles</h2>
                  <div className="profile-details">
                    {user.title && (
                      <div className="detail-item">
                        <span className="detail-label">Titre :</span>
                        <span className="detail-value">{user.title}</span>
                      </div>
                    )}
                    {user.hourlyRate && (
                      <div className="detail-item">
                        <span className="detail-label">Taux horaire :</span>
                        <span className="detail-value">{user.hourlyRate} €/h</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {user.skills && user.skills.length > 0 && (
                <div className="profile-section">
                  <h2>🎯 Compétences</h2>
                  <div className="skills-list">
                    {user.skills.map((skill, index) => (
                      <span key={index} className="skill-badge">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Statistiques */}
          <div className="profile-section">
            <h2>📊 Informations du compte</h2>
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-value">
                  {user.role === 'client' ? 'Client' : 
                   user.role === 'freedev' ? 'FreeDev' : 
                   'Admin'}
                </span>
                <span className="stat-label">Type de compte</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">
                  {user.isVerified ? '✅' : '⏳'}
                </span>
                <span className="stat-label">
                  {user.isVerified ? 'Compte vérifié' : 'En attente'}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-value">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                </span>
                <span className="stat-label">Membre depuis</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;