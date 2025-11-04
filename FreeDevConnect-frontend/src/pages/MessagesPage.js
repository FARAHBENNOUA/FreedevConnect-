import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/messages.css';

const MessagesPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }
    setLoading(false);
  }, [isAuthenticated, user, navigate]);

  if (loading || !user) {
    return (
      <div className="messages-page">
        <div className="loading">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="messages-page">
      <div className="messages-container">
        <h1>💬 Messages</h1>
        <div className="messages-empty">
          <p>Aucun message pour le moment</p>
          <small>Les messages s'afficheront ici une fois que vous commencerez à communiquer avec d'autres utilisateurs.</small>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;