import React from 'react';
import LoginForm from '../components/auth/LoginForm.js';
import '../styles/pages/login.css';

const LoginPage = () => {
  return (
    <div className="login-page">
      <div 
        className="login-background"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1920&h=1080&fit=crop&q=80)'
        }}
      >
        <div className="background-overlay"></div>
      </div>
      
      <div className="login-card">
        <div className="login-header">
          <h1>Bienvenue sur FreeDevConnect</h1>
          <p>Connectez-vous pour accéder à votre compte</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;