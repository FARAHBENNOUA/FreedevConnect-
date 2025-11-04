import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import '../../styles/pages/projects.css';

const ProjectDetails = ({ project, onApply, isClient, isOwner, isApplied }) => {
  const { 
    title, 
    description, 
    budget, 
    skills, 
    deadline, 
    clientName, 
    clientRating, 
    postedDate,
    applicationsCount
  } = project;

  return (
    <div className="project-details-container">
      <div className="project-details-header">
        <h1>{title}</h1>
        <div className="project-budget-badge">{budget}€</div>
      </div>

      <div className="project-meta-info">
        <div className="meta-item">
          <i className="icon-calendar"></i>
          <span>Publié le {new Date(postedDate).toLocaleDateString()}</span>
        </div>
        <div className="meta-item">
          <i className="icon-clock"></i>
          <span>Échéance : {new Date(deadline).toLocaleDateString()}</span>
        </div>
        <div className="meta-item">
          <i className="icon-user"></i>
          <span>Client : {clientName}</span>
        </div>
        <div className="meta-item">
          <i className="icon-star"></i>
          <span>
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={`star ${i < clientRating ? 'filled' : ''}`}>★</span>
            ))}
          </span>
        </div>
      </div>

      <div className="project-details-content">
        <h2>Description du projet</h2>
        <div className="project-description">
          {description}
        </div>

        <h2>Compétences requises</h2>
        <div className="project-skills">
          {skills.map((skill, index) => (
            <span key={index} className="skill-tag">{skill}</span>
          ))}
        </div>
      </div>

      <div className="project-details-footer">
        {isClient ? (
          isOwner ? (
            <div className="project-owner-actions">
              <p>Nombre de candidatures : {applicationsCount}</p>
              <div className="action-buttons">
                <Button as={Link} to={`/client/proposals/${project.id}`} variant="primary">
                  Voir les candidatures
                </Button>
                <Button as={Link} to={`/client/projects/${project.id}/edit`} variant="secondary">
                  Modifier le projet
                </Button>
              </div>
            </div>
          ) : (
            <div className="view-only-message">
              <p>Vous êtes connecté en tant que client et ne pouvez pas postuler à ce projet.</p>
            </div>
          )
        ) : (
          <div className="apply-section">
            {isApplied ? (
              <div className="already-applied">
                <p>Vous avez déjà postulé à ce projet.</p>
                <Button as={Link} to="/dashboard" variant="secondary">
                  Voir mes candidatures
                </Button>
              </div>
            ) : (
              <div className="apply-button">
                <p>Intéressé par ce projet?</p>
                <Button onClick={onApply} variant="primary">
                  Postuler maintenant
                </Button>
              </div>
)}
</div>
)}
</div>
</div>
);
};

export default ProjectDetails