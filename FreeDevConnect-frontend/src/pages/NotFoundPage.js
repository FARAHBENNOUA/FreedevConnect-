
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import '../styles/pages/notfound.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Page introuvable</h2>
        <p>La page que vous recherchez n'existe pas ou a été déplacée.</p>
        <Button as={Link} to="/" variant="primary">
          Retour à l'accueil
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
