import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNotification } from '../../contexts/NotificationContext';
import Button from '../common/Button';
import axios from 'axios';
import '../../styles/components/forms.css';

const ApplicationForm = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [project, setProject] = useState(null);
  const [formData, setFormData] = useState({
    coverLetter: '',
    proposedPrice: '',
    estimatedDuration: ''
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8889/api/projects/${projectId}`);
        
        console.log('✅ Projet chargé:', response.data);
        
        const projectData = response.data.data || response.data;
        setProject(projectData);
        
        // Pré-remplir le prix avec le budget du projet
        setFormData(prevState => ({
          ...prevState,
          proposedPrice: projectData.budget
        }));
      } catch (error) {
        console.error('❌ Erreur chargement projet:', error);
        addNotification('❌ Erreur lors du chargement du projet', 'error');
        navigate('/projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, navigate, addNotification]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        addNotification('❌ Vous devez être connecté', 'error');
        navigate('/login');
        return;
      }

      const applicationData = {
        coverLetter: formData.coverLetter,
        proposedPrice: parseFloat(formData.proposedPrice),
        estimatedDuration: formData.estimatedDuration
      };

      console.log('📤 Envoi candidature:', applicationData);

      const response = await axios.post(
        `http://localhost:8889/api/projects/${projectId}/apply`,
        applicationData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Candidature envoyée:', response.data);
      
      addNotification('✅ Candidature envoyée avec succès !', 'success');
      navigate('/freelance/dashboard');
    } catch (error) {
      console.error('❌ Erreur candidature:', error);
      addNotification(
        error.response?.data?.message || '❌ Erreur lors de l\'envoi de la candidature', 
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading-spinner">Chargement du projet...</div>;
  }

  if (!project) {
    return <div className="error-message">Projet non trouvé</div>;
  }

  // Parser les skills si c'est un JSON string
  let skills = [];
  if (typeof project.skillsRequired === 'string') {
    try {
      skills = JSON.parse(project.skillsRequired);
    } catch (e) {
      skills = [project.skillsRequired];
    }
  } else if (Array.isArray(project.skillsRequired)) {
    skills = project.skillsRequired;
  }

  return (
    <div className="form-container application-form">
      <h2>📝 Candidature pour le projet</h2>
      
      <div className="project-summary">
        <h3>{project.title}</h3>
        <div className="project-meta">
          <p><strong>Budget proposé:</strong> {project.budget}€</p>
          <p><strong>Date limite:</strong> {new Date(project.deadline).toLocaleDateString()}</p>
        </div>
        <p className="project-description">{project.description}</p>
        {skills.length > 0 && (
          <div className="project-skills">
            <strong>Compétences recherchées:</strong>
            <div className="skills-tags">
              {skills.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="proposedPrice">Votre tarif (€) *</label>
            <input
              type="number"
              id="proposedPrice"
              name="proposedPrice"
              value={formData.proposedPrice}
              onChange={handleChange}
              className="form-control"
              min="1"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="estimatedDuration">Durée estimée *</label>
            <input
              type="text"
              id="estimatedDuration"
              name="estimatedDuration"
              value={formData.estimatedDuration}
              onChange={handleChange}
              className="form-control"
              placeholder="Ex: 2 semaines, 1 mois"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="coverLetter">Votre message *</label>
          <textarea
            id="coverLetter"
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleChange}
            rows="6"
            className="form-control"
            required
            placeholder="Présentez-vous, expliquez votre approche pour ce projet et pourquoi vous êtes le meilleur candidat..."
          ></textarea>
        </div>

        <div className="form-group form-checkbox">
          <input
            type="checkbox"
            id="terms"
            required
          />
          <label htmlFor="terms">
            Je confirme avoir lu les détails du projet et accepte les conditions générales
          </label>
        </div>

        <div className="form-actions">
          <Button 
            type="button" 
            variant="secondary"
            onClick={() => navigate(`/projects/${projectId}`)}
          >
            Annuler
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            disabled={submitting}
          >
            {submitting ? '⏳ Envoi en cours...' : '✅ Envoyer ma candidature'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;