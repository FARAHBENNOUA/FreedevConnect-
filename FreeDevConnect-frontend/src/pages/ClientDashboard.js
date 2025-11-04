import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectsService } from '../api/config';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import '../styles/pages/dashboard.css';

const ClientDashboard = () => {
  const { currentUser } = useAuth();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeProjects: 0,
    completedProjects: 0,
    totalSpent: 0,
    totalProposals: 0
  });
  const [projects, setProjects] = useState([]);
  const [freelances, setFreelances] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Tentative avec API réelle
        try {
          const projectsResponse = await projectsService.getAll({ clientId: currentUser.id });
          setProjects(projectsResponse.data);
          
          // Récupérer les freelances
          const token = localStorage.getItem('token');
          const freelancesResponse = await fetch('/api/freelances', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (freelancesResponse.ok) {
            const freelancesData = await freelancesResponse.json();
            setFreelances(freelancesData.slice(0, 3)); // 3 premiers freelances
          }
          
          // Calculer les statistiques
          const activeProjects = projectsResponse.data.filter(p => p.status === 'active');
          const completedProjects = projectsResponse.data.filter(p => p.status === 'completed');
          
          const totalSpent = completedProjects.reduce((sum, project) => sum + project.budget, 0);
          const totalProposals = projectsResponse.data.reduce((sum, project) => sum + (project.proposalsCount || 0), 0);
          
          setStats({
            activeProjects: activeProjects.length,
            completedProjects: completedProjects.length,
            totalSpent,
            totalProposals
          });
        } catch (apiError) {
          console.warn('API indisponible, utilisation de données fictives');
          
          // Données fictives si API échoue
          const dummyProjects = [
            {
              id: 1,
              title: "Site e-commerce pour ma boutique",
              status: "active",
              budget: 2500,
              deadline: "2023-11-15",
              proposalsCount: 5
            },
            {
              id: 2,
              title: "Application mobile pour restaurant",
              status: "completed",
              budget: 3800,
              completedAt: "2023-09-20",
              freelancer: { name: "Marie Dubois" }
            }
          ];
          
          const dummyFreelances = [
            {
              id: 1,
              name: "Marie Dubois",
              title: "Développeuse Full Stack",
              skills: ["React", "Node.js", "MongoDB"],
              rating: 4.8,
              hourlyRate: 45,
              availability: "disponible"
            },
            {
              id: 2,
              name: "Jean Martin",
              title: "Designer UX/UI",
              skills: ["Figma", "Adobe XD"],
              rating: 4.9,
              hourlyRate: 40,
              availability: "disponible"
            },
            {
              id: 3,
              name: "Sophie Laurent",
              title: "Développeuse Mobile",
              skills: ["React Native", "Flutter"],
              rating: 4.7,
              hourlyRate: 50,
              availability: "occupé"
            }
          ];
          
          setProjects(dummyProjects);
          setFreelances(dummyFreelances);
          setStats({
            activeProjects: 1,
            completedProjects: 1,
            totalSpent: 3800,
            totalProposals: 5
          });
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données du tableau de bord:', error);
        addNotification('Erreur lors du chargement des données', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser, addNotification]);

  if (loading) {
    return <div className="loading-spinner">Chargement du tableau de bord...</div>;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Tableau de bord Client</h1>
        <div className="header-actions">
          <Button as={Link} to="/client/projects/new" variant="primary">
            Publier un nouveau projet
          </Button>
        </div>
      </div>

      <div className="dashboard-stats">
        <Card className="stat-card">
          <div className="stat-value">{stats.activeProjects}</div>
          <div className="stat-label">Projets actifs</div>
        </Card>
        <Card className="stat-card">
          <div className="stat-value">{stats.completedProjects}</div>
          <div className="stat-label">Projets terminés</div>
        </Card>
        <Card className="stat-card">
          <div className="stat-value">{stats.totalSpent}€</div>
          <div className="stat-label">Total dépensé</div>
        </Card>
        <Card className="stat-card">
          <div className="stat-value">{stats.totalProposals}</div>
          <div className="stat-label">Propositions reçues</div>
        </Card>
      </div>

      {/* NOUVELLE SECTION - Freelances recommandés */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Freelances recommandés</h2>
          <Link to="/freelances" className="view-all">Voir tous les freelances</Link>
        </div>
        {freelances.length === 0 ? (
          <div className="empty-state">
            <p>Aucun freelance disponible pour le moment</p>
            <Button as={Link} to="/freelances">Parcourir les freelances</Button>
          </div>
        ) : (
          <div className="freelances-preview">
            {freelances.map(freelance => (
              <Card key={freelance.id} className="freelance-preview-card">
                <div className="freelance-header">
                  <h3>{freelance.name}</h3>
                  <span className={`availability-badge ${freelance.availability}`}>
                    {freelance.availability === 'disponible' ? '🟢' : '🔴'} {freelance.availability}
                  </span>
                </div>
                <p className="freelance-title">{freelance.title}</p>
                <div className="freelance-rating">
                  <span className="rating">⭐ {freelance.rating}</span>
                  <span className="hourly-rate">{freelance.hourlyRate}€/h</span>
                </div>
                <div className="freelance-skills">
                  {freelance.skills.slice(0, 3).map(skill => (
                    <span key={skill} className="skill-tag">{skill}</span>
                  ))}
                </div>
                <div className="freelance-actions">
                  <Button as={Link} to={`/freelance/profile/${freelance.id}`} size="sm">
                    Voir profil
                  </Button>
                  <Button as={Link} to={`/contact?freelance=${freelance.id}`} variant="primary" size="sm">
                    Contacter
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* SECTION - Actions rapides */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Actions rapides</h2>
        </div>
        <div className="quick-actions-grid">
          <Card className="quick-action-card">
            <h3>🔍 Trouver un freelance</h3>
            <p>Parcourez notre base de freelances qualifiés</p>
            <Button as={Link} to="/freelances" variant="primary">
              Voir les freelances
            </Button>
          </Card>
          <Card className="quick-action-card">
            <h3>📝 Publier un projet</h3>
            <p>Décrivez votre projet et recevez des propositions</p>
            <Button as={Link} to="/client/projects/new" variant="primary">
              Créer un projet
            </Button>
          </Card>
          <Card className="quick-action-card">
            <h3>💬 Mes messages</h3>
            <p>Communiquez avec vos freelances</p>
            <Button as={Link} to="/messages" variant="primary">
              Voir les messages
            </Button>
          </Card>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2>Mes projets actifs</h2>
        </div>
        {projects.filter(p => p.status === 'active').length === 0 ? (
          <div className="empty-state">
            <p>Vous n'avez pas de projets actifs</p>
            <Button as={Link} to="/client/projects/new">Publier un projet</Button>
          </div>
        ) : (
          <div className="projects-grid">
            {projects
              .filter(p => p.status === 'active')
              .map(project => (
                <Card key={project.id} className="project-card">
                  <div className="project-card-header">
                    <h3><Link to={`/projects/${project.id}`}>{project.title}</Link></h3>
                    <span className="status-badge status-active">Actif</span>
                  </div>
                  <div className="project-card-body">
                    <div className="project-info">
                      <div><strong>Budget:</strong> {project.budget}€</div>
                      <div><strong>Date limite:</strong> {new Date(project.deadline).toLocaleDateString()}</div>
                      <div><strong>Propositions:</strong> {project.proposalsCount || 0}</div>
                    </div>
                  </div>
                  <div className="project-card-footer">
                    <Button as={Link} to={`/projects/${project.id}`} variant="secondary" size="sm">
                      Voir le projet
                    </Button>
                    <Button 
                      as={Link} 
                      to={`/client/proposals/${project.id}`} 
                      variant="primary" 
                      size="sm"
                      disabled={!project.proposalsCount}
                    >
                      Voir les propositions
                    </Button>
                  </div>
                </Card>
              ))}
          </div>
        )}
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2>Projets terminés</h2>
        </div>
        {projects.filter(p => p.status === 'completed').length === 0 ? (
          <div className="empty-state">
            <p>Vous n'avez pas encore de projets terminés</p>
          </div>
        ) : (
          <div className="projects-table">
            <table>
              <thead>
                <tr>
                  <th>Projet</th>
                  <th>Freelance</th>
                  <th>Budget</th>
                  <th>Date de fin</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects
                  .filter(p => p.status === 'completed')
                  .map(project => (
                    <tr key={project.id}>
                      <td>
                        <Link to={`/projects/${project.id}`}>{project.title}</Link>
                      </td>
                      <td>{project.freelancer?.name || 'N/A'}</td>
                      <td>{project.budget}€</td>
                      <td>{project.completedAt ? new Date(project.completedAt).toLocaleDateString() : 'N/A'}</td>
                      <td>
                        <Link to={`/projects/${project.id}`} className="btn-link">
                          Détails
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;