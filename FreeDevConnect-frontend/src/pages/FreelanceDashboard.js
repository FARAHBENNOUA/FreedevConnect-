import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import apiClient from '../api/config'; 
import '../styles/pages/dashboard.css';

const FreelanceDashboard = () => {
  const { user, isAuthenticated, isInitializing } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    activeProjects: 0,
    completedProjects: 0,
    totalEarned: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await apiClient.get('/freelance-dashboard');
        setApplications(response.data.applications || []);
        setProjects(response.data.projects || []);
        setStats(response.data.stats || {
          activeProjects: 0,
          completedProjects: 0,
          totalEarned: 0
        });
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="loading-spinner">Chargement...</div>;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Tableau de bord Freelance</h1>
        <Button as={Link} to="/projects">Trouver des projets</Button>
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
          <div className="stat-value">{stats.totalEarned}€</div>
          <div className="stat-label">Total gagné</div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Mes projets en cours</h2>

        {projects.length === 0 ? (
          <div className="empty-state">
            <p>Vous n'avez pas encore de projets en cours</p>
            <Button as={Link} to="/projects">Parcourir les projets disponibles</Button>
          </div>
        ) : (
          <div className="projects-list">
            {projects.map(project => (
              <Card key={project.id} className="project-card">
                <h3><Link to={`/projects/${project.id}`}>{project.title}</Link></h3>
                <span className={`status-badge status-${project.status}`}>
                  {project.status === 'in_progress' ? 'En cours' : 'Terminé'}
                </span>
                <div className="card-actions">
                  <Button
                    variant="primary"
                    onClick={() => {
                      if (isInitializing) {
                        console.log('⏳ Auth en cours...');
                        return;
                      }

                      if (!isAuthenticated || !user || user.role !== 'freedev') {
                        console.warn('⛔ Redirection vers /login');
                        navigate('/login');
                      } else {
                        console.log('✅ Redirection vers candidature projet', project.id);
                        navigate(`/freelance/application/${project.id}`);
                      }
                    }}
                  >
                    Postuler
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FreelanceDashboard;
