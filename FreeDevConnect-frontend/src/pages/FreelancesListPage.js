import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import axios from 'axios';
import '../styles/pages/freelance.css';  

const FreelancesListPage = () => {
  const { user } = useAuth();
  const [freelances, setFreelances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFreelances = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        
        console.log('🔐 Token trouvé:', token ? 'Oui' : 'Non');
        
        const response = await axios.get('http://localhost:8889/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('✅ Données reçues:', response.data);
        
        // Filtrer les freelances (role = 'freedev')
        let freelancesList = [];
        if (Array.isArray(response.data)) {
          freelancesList = response.data.filter(u => u.role === 'freedev');
        } else if (response.data.users) {
          freelancesList = response.data.users.filter(u => u.role === 'freedev');
        } else if (response.data.data) {
          freelancesList = response.data.data.filter(u => u.role === 'freedev');
        }
        
        console.log('👥 Freelances trouvés:', freelancesList.length);
        setFreelances(freelancesList);
        
      } catch (apiError) {
        console.error('❌ Erreur API:', apiError);
        setError('Erreur de connexion au serveur');
        setFreelances([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFreelances();
  }, []);

  if (loading) {
    return <div className="loading-spinner">Chargement des freelances...</div>;
  }

  return (
    <div className="freelances-list-page">
      <div className="page-header">
        <h1>💼 Liste des Freelances</h1>
        <p>Freelances disponibles sur la plateforme ({freelances.length})</p>
        {error && <div className="error-notice">⚠️ {error}</div>}
      </div>

      {freelances.length === 0 ? (
        <div className="empty-state">
          <h3>Aucun freelance trouvé</h3>
          <p>Il n'y a pas encore de freelances inscrits sur la plateforme.</p>
          <Button as={Link} to="/register">
            Devenir freelance
          </Button>
        </div>
      ) : (
        <div className="freelances-grid">
          {freelances.map(freelance => (
            <Card key={freelance.id} className="freelance-card">
              <div className="freelance-header">
                <h3>{freelance.firstName} {freelance.lastName}</h3>
                <span className="freelance-role">💼 FreeDev</span>
              </div>
              
              <div className="freelance-details">
                <p><strong>Email:</strong> {freelance.email}</p>
                {freelance.city && (
                  <p><strong>Ville:</strong> {freelance.city}</p>
                )}
                {freelance.bio && (
                  <p><strong>Bio:</strong> {freelance.bio.substring(0, 100)}...</p>
                )}
              </div>
              
              <div className="freelance-actions">
                <Button as={Link} to={`/freelances/${freelance.id}`}>
                  Voir profil
                </Button>
                {user ? (
                  <Button as={Link} to={`/messages?user=${freelance.id}`}>
                    Contacter
                  </Button>
                ) : (
                  <Button as={Link} to="/login">
                    Se connecter
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FreelancesListPage;