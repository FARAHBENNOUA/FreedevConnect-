import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import axios from 'axios';
import '../../styles/pages/dashboard.css';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8889/api/projects');
      setProjects(response.data.data || response.data);
    } catch (error) {
      console.error('❌ Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Supprimer ce projet ?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8889/api/projects/${projectId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchProjects();
      alert('✅ Projet supprimé');
    } catch (error) {
      console.error('❌ Erreur:', error);
      alert('❌ Erreur lors de la suppression');
    }
  };

  if (loading) return <div className="loading-spinner">Chargement...</div>;

  return (
    <div className="admin-page">
      <h1>📋 Gestion des projets</h1>
      <p>Total : {projects.length} projets</p>

      <div className="projects-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Titre</th>
              <th>Budget</th>
              <th>Status</th>
              <th>Client</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>
                  <Link to={`/projects/${p.id}`}>{p.title}</Link>
                </td>
                <td>{p.budget}€</td>
                <td>
                  <span className={`status-badge status-${p.status}`}>
                    {p.status}
                  </span>
                </td>
                <td>{p.clientFirstName} {p.clientLastName}</td>
                <td>
                  <Button 
                    variant="danger" 
                    onClick={() => handleDeleteProject(p.id)}
                  >
                    🗑️ Supprimer
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProjects;