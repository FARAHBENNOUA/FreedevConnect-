import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { projectsService } from '../../api/config';
import Button from '../common/Button';
import Card from '../common/Card';

const ClientProjectsList = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientProjects = async () => {
      try {
        const response = await projectsService.getByClient(currentUser.id);
        setProjects(response.data.projects || []);
      } catch (error) {
        console.error('Erreur chargement projets client:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.id) {
      fetchClientProjects();
    }
  }, [currentUser]);

  const handleDelete = async (projectId) => {
    if (!window.confirm('Confirmer la suppression de ce projet ?')) return;

    try {
      await projectsService.delete(projectId);
      setProjects(prev => prev.filter(p => p.id !== projectId));
      navigate('/client/projects'); // ✅ redirection après suppression
    } catch (error) {
      console.error('Erreur suppression projet:', error);
      alert('Erreur lors de la suppression du projet.');
    }
  };

  if (loading) return <div>Chargement des projets...</div>;

  return (
    <div className="client-projects-list">
      <h2>Mes projets publiés</h2>

      {projects.length === 0 ? (
        <p>Vous n'avez encore publié aucun projet.</p>
      ) : (
        <div className="projects-list">
          {projects.map(project => (
            <Card key={project.id} className="project-card">
              <div className="project-header">
                <h3>
                  <Link to={`/projects/${project.id}`}>{project.title}</Link>
                </h3>
                <span className={`status-badge status-${project.status}`}>
                  {project.status === 'active' ? 'Actif' : 'Terminé'}
                </span>
              </div>

              <div className="project-details">
                <p><strong>Budget:</strong> {project.budget}€</p>
                <p><strong>Date limite:</strong> {new Date(project.deadline).toLocaleDateString()}</p>
                <p><strong>{project.applications}</strong> candidatures</p>
              </div>

              <div className="project-actions">
                <Button as={Link} to={`/client/projects/edit/${project.id}`} variant="secondary" size="sm">
                  Modifier
                </Button>
                <Button onClick={() => handleDelete(project.id)} variant="danger" size="sm">
                  Supprimer
                </Button>
                <Button as={Link} to={`/client/proposals/${project.id}`} variant="primary" size="sm">
                  Voir les candidatures
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientProjectsList;
