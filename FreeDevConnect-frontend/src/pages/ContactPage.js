import React, { useState } from 'react';
import { useNotification } from '../contexts/NotificationContext';
import { api as apiClient } from '../api/config';
import '../styles/pages/contact.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    sujet: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await apiClient.post('/contact', formData);
      
      if (response.ok || response.status === 200) {
        addNotification('Message envoyé avec succès!', 'success');
        setFormData({ nom: '', email: '', sujet: '', message: '' });
      } else {
        throw new Error('Erreur de réponse du serveur');
      }
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      addNotification('Erreur lors de l\'envoi du message', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1>Contactez-nous</h1>
        <p>N'hésitez pas à nous contacter pour toute question ou collaboration.</p>
      </div>
      
      <div className="contact-container">
        <div className="contact-info">
          <div className="info-item">
            <i className="fas fa-map-marker-alt"></i>
            <div>
              <h3>Adresse</h3>
              <p>99 Rue des souhaits<br />99 999 Firdaws, France</p>
            </div>
          </div>
          <div className="info-item">
            <i className="fas fa-phone"></i>
            <div>
              <h3>Téléphone</h3>
              <p>+33 1 36 79 29 09</p>
            </div>
          </div>
          <div className="info-item">
            <i className="fas fa-envelope"></i>
            <div>
              <h3>Email</h3>
              <p><a href="mailto:bennouafarah@gmail.com">bennouafarah@gmail.com</a></p>
            </div>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <h2>Envoyez-nous un message</h2>
          
          <div className="form-group">
            <label htmlFor="nom">Nom complet</label>
            <input 
              type="text"
              id="nom"
              placeholder="Votre nom"
              value={formData.nom}
              onChange={(e) => setFormData({...formData, nom: e.target.value})}
              required 
              disabled={isSubmitting}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email"
              id="email"
              placeholder="votre@email.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required 
              disabled={isSubmitting}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="sujet">Sujet</label>
            <input 
              type="text"
              id="sujet"
              placeholder="Sujet de votre message"
              value={formData.sujet}
              onChange={(e) => setFormData({...formData, sujet: e.target.value})}
              required 
              disabled={isSubmitting}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              placeholder="Votre message..."
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              required
              disabled={isSubmitting}
              rows="5"
            />
          </div>
          
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;