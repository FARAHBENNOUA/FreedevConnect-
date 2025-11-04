import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import Card from '../common/Card';

const ProposalCard = ({ proposal, hasApplied }) => {
  if (!proposal) return null;

  const {
    id,
    title,
    status,
    budget,
    deadline,
    skills = []
  } = proposal;

  const formattedDeadline = deadline
    ? new Date(deadline).toLocaleDateString()
    : 'Non spécifiée';

  return (
    <Card className="proposal-card">
      <div className="proposal-header">
        <h3>
          <Link to={`/projects/${id}`}>{title || 'Projet sans titre'}</Link>
        </h3>
        <span className={`status-badge status-${status}`}>
          {status === 'active' ? 'Actif' : 'Terminé'}
        </span>
      </div>

      <div className="proposal-details">
        <p><strong>Budget:</strong> {budget ? `${budget}€` : 'Non défini'}</p>
        <p><strong>Date limite:</strong> {formattedDeadline}</p>
        <p><strong>Compétences:</strong> {skills.length > 0 ? skills.join(', ') : 'Aucune'}</p>
      </div>

      <div className="proposal-actions">
        {hasApplied ? (
          <span className="status-badge applied">✅ Candidature envoyée</span>
        ) : (
          <Button as={Link} to={`/freelance/application/${id}`} variant="primary" size="sm">
            Postuler
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ProposalCard;
