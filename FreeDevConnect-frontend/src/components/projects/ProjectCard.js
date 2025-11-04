import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';
import '../../styles/pages/projects.css';

const ProjectCard = ({ project }) => {
  const { user, isAuthenticated, isInitializing } = useAuth();
  const navigate = useNavigate();

  if (!project) {
    return (
      <div className="project-card">
        <p>Projet non disponible</p>
      </div>
    );
  }

  const {
    id,
    title,
    description,
    budget,
    skills,
    deadline,
    clientName,
    clientRating,
    postedDate
  } = project;

  const handlePostuler = () => {
    if (isInitializing) {
      console.log('⏳ Auth en cours...');
      return;
    }

    if (!isAuthenticated || !user || user.role !== 'freedev') {
      console.warn('⛔ Redirection vers /login');
      navigate('/login');
    } else {
      console.log('✅ Redirection vers candidature projet', id);
      navigate(`/freelance/application/${id}`);
    }
  };

  return (
    <div className="project-card">
      <div className="project-card-header">
        <h3>
          <Link to={`/projects/${id}`}>
            {title || 'Projet sans titre'}
          </Link>
        </h3>
        <div className="project-budget">
          {budget ? `${budget}€` : 'Budget à définir'}
        </div>
      </div>

      <p className="project-description">
        {description
          ? (description.length > 150 ? `${description.substring(0, 150)}...` : description)
          : 'Aucune description disponible'
        }
      </p>

      <div className="project-skills">
        {skills && Array.isArray(skills) && skills.length > 0 ? (
          skills.map((skill, index) => (
            <span key={index} className="skill-tag">{skill}</span>
          ))
        ) : skills && typeof skills === 'string' ? (
          <span className="skill-tag">{skills}</span>
        ) : (
          <span className="skill-tag">Compétences non spécifiées</span>
        )}
      </div>

      <div className="project-footer">
        <div className="project-client">
          <div className="client-info">
            <span>{clientName || 'Client anonyme'}</span>
            {clientRating && (
              <div className="client-rating">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={`star ${i < clientRating ? 'filled' : ''}`}>★</span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="project-meta">
          {postedDate && (
            <div className="posted-date">
              Publié le {new Date(postedDate).toLocaleDateString()}
            </div>
          )}
          {deadline && (
            <div className="deadline">
              Échéance : {new Date(deadline).toLocaleDateString()}
            </div>
          )}
        </div>
        <div className="project-actions">
          <Button variant="primary" onClick={handlePostuler}>
            Postuler
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
