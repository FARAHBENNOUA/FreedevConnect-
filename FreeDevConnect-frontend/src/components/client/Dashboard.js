import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import apiClient from '../../api/config'; // Utilisation du client API configuré
import '../../styles/pages/dashboard.css';

const ClientDashboard = () => {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    activeProjects: 0,
    completedProjects: 0,
    totalSpent: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiClient.get('/projects'); // Correction : utilisation de apiClient
        setProjects(response.data.projects);
        setStats({
          activeProjects: response.data.activeProjects,
          completedProjects: response.data.completedProjects,
          totalSpent: response.data.totalSpent
        });
      } catch (error) {
        console.error("Erreur lors du chargement des projets :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <div className="loading-spinner">Chargement...</div>;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Tableau de bord Client</h1>
        <Button as={Link} to="/client/projects/new">
          Publier un nouveau projet
        </Button>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-value">{stats.activeProjects}</div>
          <div className="stat-label">Projets actifs</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.completedProjects}</div>
          <div className="stat-label">Projets terminés</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalSpent}€</div>
          <div className="stat-label">Total dépensé</div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Mes projets</h2>

        {projects.length === 0 ? (
          <div className="empty-state">
            <p>Vous n'avez pas encore de projets</p>
            <Button as={Link} to="/client/projects/new">
              Créer mon premier projet
            </Button>
          </div>
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
                  <div className="project-info">
                    <p><strong>Budget:</strong> {project.budget}€</p>
                    <p><strong>Date limite:</strong> {new Date(project.deadline).toLocaleDateString()}</p>
                  </div>
                  <div className="project-applications">
                    <p><strong>{project.applications}</strong> candidatures</p>
                    {project.status === 'active' && (
                      <Button as={Link} to={`/client/proposals/${project.id}`} variant="secondary" size="sm">
                        Voir les candidatures
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;
