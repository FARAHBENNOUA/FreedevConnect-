import React from 'react';
import Button from '../common/Button';
import '../../styles/pages/dashboard.css';

const AdminModeration = () => {
  return (
    <div className="admin-page">
      <h1>🛡️ Modération</h1>
      
      <div className="moderation-stats">
        <div className="stat-card">
          <div className="stat-value">0</div>
          <div className="stat-label">Contenus signalés</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">0</div>
          <div className="stat-label">En attente</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">0</div>
          <div className="stat-label">Traités aujourd'hui</div>
        </div>
      </div>

      <div className="empty-state">
        <h3>✅ Aucun contenu à modérer</h3>
        <p>Tous les contenus sont conformes aux règles de la plateforme.</p>
      </div>
    </div>
  );
};

export default AdminModeration;