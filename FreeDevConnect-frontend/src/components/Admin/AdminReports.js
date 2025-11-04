import React from 'react';
import Button from '../common/Button';
import '../../styles/pages/dashboard.css';

const AdminReports = () => {
  return (
    <div className="admin-page">
      <h1>⚠️ Signalements</h1>
      
      <div className="reports-stats">
        <div className="stat-card">
          <div className="stat-value">0</div>
          <div className="stat-label">Signalements totaux</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">0</div>
          <div className="stat-label">Ouverts</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">0</div>
          <div className="stat-label">Résolus</div>
        </div>
      </div>

      <div className="empty-state">
        <h3>✅ Aucun signalement</h3>
        <p>Aucun utilisateur n'a signalé de contenu inapproprié.</p>
      </div>
    </div>
  );
};

export default AdminReports;