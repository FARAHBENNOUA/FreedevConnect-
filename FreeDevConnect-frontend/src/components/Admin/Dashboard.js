import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import apiClient from '../../api/config';
import '../../styles/pages/dashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalFreeDev: 0,
    totalClients: 0,
    activeProjects: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await apiClient.get('/admin/dashboard');
        setUsers(response.data.users || []);
        setProjects(response.data.projects || []);
        setStats(response.data.stats || {
          totalUsers: 0,
          totalProjects: 0,
          totalFreeDev: 0,
          totalClients: 0,
          activeProjects: 0,
          revenue: 0
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
        <h1>🛡️ Dashboard Administrateur</h1>
        <p>Bienvenue, {user?.firstName} {user?.lastName}</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-value">{stats.totalUsers}</div>
          <div className="stat-label">Utilisateurs totaux</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalFreeDev}</div>
          <div className="stat-label">FreeDev actifs</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalClients}</div>
          <div className="stat-label">Clients inscrits</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalProjects}</div>
          <div className="stat-label">Projets totaux</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.activeProjects}</div>
          <div className="stat-label">Projets en cours</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.revenue}€</div>
          <div className="stat-label">Revenus totaux</div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Actions rapides</h2>
        <div className="admin-actions">
          <Button as={Link} to="/admin/users">👥 Gérer les utilisateurs</Button>
          <Button as={Link} to="/admin/projects">📋 Gérer les projets</Button>
          <Button as={Link} to="/admin/moderation">🛡️ Modération</Button>
          <Button as={Link} to="/admin/reports">⚠️ Signalements</Button>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Derniers utilisateurs inscrits</h2>
        {users.length === 0 ? (
          <div className="empty-state">
            <p>Aucun nouvel utilisateur</p>
          </div>
        ) : (
          <div className="users-list">
            {users.slice(0, 5).map(user => (
              <Card key={user.id} className="user-card">
                <div className="user-info">
                  <h4>{user.firstName} {user.lastName}</h4>
                  <p>{user.email}</p>
                  <span className={`role-badge role-${user.role}`}>
                    {user.role}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="dashboard-section">
        <h2>Projets récents</h2>
        {projects.length === 0 ? (
          <div className="empty-state">
            <p>Aucun projet récent</p>
          </div>
        ) : (
          <div className="projects-list">
            {projects.slice(0, 5).map(project => (
              <Card key={project.id} className="project-card">
                <h3><Link to={`/projects/${project.id}`}>{project.title}</Link></h3>
                <span className={`status-badge status-${project.status}`}>
                  {project.status}
                </span>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
