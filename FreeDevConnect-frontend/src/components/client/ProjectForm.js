import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../contexts/NotificationContext';
import Button from '../common/Button';
import axios from 'axios';
import '../../styles/components/forms.css';

const ProjectForm = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
    skillsRequired: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        addNotification('❌ Vous devez être connecté pour créer un projet', 'error');
        navigate('/login');
        return;
      }

      // Formatage des données avant envoi
      const projectData = {
        title: formData.title,
        description: formData.description,
        budget: parseFloat(formData.budget),
        deadline: formData.deadline,
        skillsRequired: formData.skillsRequired.split(',').map(skill => skill.trim())
      };

      console.log('📤 Envoi du projet:', projectData);

      const response = await axios.post(
        'http://localhost:8889/api/projects',
        projectData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Projet créé:', response.data);
      
      addNotification('✅ Projet créé avec succès !', 'success');
      navigate(`/projects/${response.data.data?.id || response.data.id}`);
    } catch (error) {
      console.error('❌ Erreur création projet:', error);
      console.error('❌ Détails:', error.response?.data);
      
      addNotification(
        error.response?.data?.message || '❌ Erreur lors de la création du projet', 
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container project-form">
      <h2>📋 Créer un nouveau projet</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Titre du projet *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-control"
            required
            placeholder="Ex: Développement d'un site e-commerce"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description détaillée *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="6"
            className="form-control"
            required
            placeholder="Décrivez votre projet en détail. Incluez le contexte, les objectifs et les résultats attendus."
          ></textarea>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="budget">Budget (€) *</label>
            <input
              type="number"
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="form-control"
              min="1"
              required
              placeholder="3000"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="deadline">Date limite *</label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="form-control"
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="skillsRequired">Compétences requises *</label>
          <input
            type="text"
            id="skillsRequired"
            name="skillsRequired"
            value={formData.skillsRequired}
            onChange={handleChange}
            className="form-control"
            required
            placeholder="Ex: React, Node.js, MongoDB (séparés par des virgules)"
          />
          <small style={{ color: '#666', fontSize: '12px' }}>
            Séparez les compétences par des virgules
          </small>
        </div>

        <div className="form-actions">
          <Button 
            type="button" 
            variant="secondary"
            onClick={() => navigate('/client/dashboard')}
          >
            Annuler
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            disabled={loading}
          >
            {loading ? '⏳ Création en cours...' : '✅ Créer le projet'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;