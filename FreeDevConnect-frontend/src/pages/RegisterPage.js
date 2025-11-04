import React from 'react';
import RegisterForm from '../components/auth/RegisterForm.js';
import '../styles/pages/register.css';

const RegisterPage = () => {
  return (
    <div className="register-page">
      <div 
        className="register-background"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&h=1080&fit=crop&q=80)'
        }}
      >
        <div className="background-overlay"></div>
      </div>
      
      <div className="register-card">
        <div className="register-header">
          <h1>✨ Rejoignez FreeDevConnect</h1>
          <p>Créez un compte gratuitement pour commencer à collaborer</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;