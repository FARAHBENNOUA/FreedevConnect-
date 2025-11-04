import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNotification } from '../../contexts/NotificationContext';
import { projectsService } from '../../api/config';
import Button from '../common/Button';
import '../../styles/components/forms.css';

const EditProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
    skills: ''
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await projectsService.getById(id);
        const project = response.data.project;
        setFormData({
          title: project.title,
          description: project.description,
          budget: project.budget,
          deadline: project.deadline.split('T')[0],
          skills: project.skills.join(', ')
        });
      } catch (error) {
        console.error('Erreur chargement projet:', error);
        addNotification('Projet introuvable', 'error');
        navigate('/client/projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, navigate, addNotification]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedProject = {
        ...formData,
        budget: parseFloat(formData.budget),
        skills: formData.skills.split(',').map(s => s.trim())
      };

      await projectsService.update(id, updatedProject);
      addNotification('Projet mis à jour avec succès', 'success');
      navigate(`/projects/${id}`);
    } catch (error) {
      console.error('Erreur mise à jour projet:', error);
      addNotification('Erreur lors de la mise à jour', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="form-container project-form">
      <h2>Modifier le projet</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Titre du projet*</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description*</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="6"
            required
            className="form-control"
          ></textarea>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="budget">Budget (€)*</label>
            <input
              type="number"
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              required
              className="form-control"
              min="1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="deadline">Date limite*</label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
              className="form-control"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="skills">Compétences requises*</label>
          <input
            type="text"
            id="skills"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            required
            className="form-control"
            placeholder="Ex: React, Node.js, MongoDB"
          />
        </div>

        <div className="form-actions">
          <Button type="button" variant="secondary" onClick={() => navigate('/client/projects')}>
            Annuler
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Mise à jour...' : 'Mettre à jour'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProjectForm;
