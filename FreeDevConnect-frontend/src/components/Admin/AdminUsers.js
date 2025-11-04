import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';
import Card from '../common/Card';
import axios from 'axios';
import '../../styles/pages/dashboard.css';

const AdminUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8889/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      let usersData = response.data.data || response.data;
      
      // Filtrer par rôle
      if (filter !== 'all') {
        usersData = usersData.filter(u => u.role === filter);
      }
      
      setUsers(usersData);
    } catch (error) {
      console.error('❌ Erreur chargement utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId) => {
    if (!window.confirm('Voulez-vous vraiment bloquer cet utilisateur ?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:8889/api/users/${userId}/status`,
        { status: 'suspended' },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      fetchUsers();
      alert('✅ Utilisateur bloqué');
    } catch (error) {
      console.error('❌ Erreur:', error);
      alert('❌ Erreur lors du blocage');
    }
  };

  const handleActivateUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:8889/api/users/${userId}/status`,
        { status: 'active' },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      fetchUsers();
      alert('✅ Utilisateur activé');
    } catch (error) {
      console.error('❌ Erreur:', error);
      alert('❌ Erreur lors de l\'activation');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('⚠️ ATTENTION : Supprimer définitivement cet utilisateur ?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8889/api/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchUsers();
      alert('✅ Utilisateur supprimé');
    } catch (error) {
      console.error('❌ Erreur:', error);
      alert('❌ Erreur lors de la suppression');
    }
  };

  if (loading) {
    return <div className="loading-spinner">Chargement...</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>👥 Gestion des utilisateurs</h1>
        <p>Total : {users.length} utilisateurs</p>
      </div>

      <div className="admin-filters">
        <Button 
          variant={filter === 'all' ? 'primary' : 'secondary'}
          onClick={() => setFilter('all')}
        >
          Tous ({users.length})
        </Button>
        <Button 
          variant={filter === 'client' ? 'primary' : 'secondary'}
          onClick={() => setFilter('client')}
        >
          Clients
        </Button>
        <Button 
          variant={filter === 'freedev' ? 'primary' : 'secondary'}
          onClick={() => setFilter('freedev')}
        >
          FreeDev
        </Button>
        <Button 
          variant={filter === 'admin' ? 'primary' : 'secondary'}
          onClick={() => setFilter('admin')}
        >
          Admins
        </Button>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.firstName} {u.lastName}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`role-badge role-${u.role}`}>
                    {u.role}
                  </span>
                </td>
                <td>
                  <span className={`status-badge status-${u.status}`}>
                    {u.status}
                  </span>
                </td>
                <td>
                  {u.status === 'active' ? (
                    <Button 
                      variant="warning" 
                      onClick={() => handleBlockUser(u.id)}
                    >
                      🚫 Bloquer
                    </Button>
                  ) : (
                    <Button 
                      variant="success" 
                      onClick={() => handleActivateUser(u.id)}
                    >
                      ✅ Activer
                    </Button>
                  )}
                  <Button 
                    variant="danger" 
                    onClick={() => handleDeleteUser(u.id)}
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

export default AdminUsers;