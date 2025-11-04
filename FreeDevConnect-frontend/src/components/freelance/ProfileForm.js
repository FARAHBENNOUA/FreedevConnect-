import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersService } from '../../api/config';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import Button from '../common/Button';
import '../../styles/components/forms.css';

const ProfileForm = () => {
  const navigate = useNavigate();
  const { refreshUserData } = useAuth();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    skills: '',
    hourlyRate: '',
    phone: '',
    address: '',
    website: '',
    github: '',
    linkedin: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await usersService.getProfile();
        
        // Transformer les skills de tableau en chaîne pour le formulaire
        const profileData = {
          ...response.data,
          skills: response.data.skills?.join(', ') || '',
        };
        
        setFormData(profileData);
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
        addNotification('Erreur lors du chargement du profil', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [addNotification]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Transformer la chaîne de compétences en tableau
      const profileData = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill),
        hourlyRate: parseFloat(formData.hourlyRate)
      };

      await usersService.updateProfile(profileData);
      await refreshUserData(); // Mettre à jour les données utilisateur dans le contexte
      
      addNotification('Profil mis à jour avec succès !', 'success');
      navigate('/profile');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      addNotification(
        error.response?.data?.message || 'Erreur lors de la mise à jour du profil', 
        'error'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading-spinner">Chargement du profil...</div>;
  }

  return (
    <div className="form-container profile-form">
      <h2>Modifier mon profil</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nom complet*</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="title">Titre professionnel*</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-control"
            required
            placeholder="Ex: Développeur Web Full Stack"
          />
        </div>

        <div className="form-group">
          <label htmlFor="bio">Biographie*</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="4"
            className="form-control"
            required
            placeholder="Présentez votre parcours, vos compétences et votre expérience..."
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="skills">Compétences*</label>
          <input
            type="text"
            id="skills"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            className="form-control"
            required
            placeholder="Ex: React, Node.js, MongoDB (séparés par des virgules)"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="hourlyRate">Taux horaire (€/h)*</label>
            <input
              type="number"
              id="hourlyRate"
              name="hourlyRate"
              value={formData.hourlyRate}
              onChange={handleChange}
              className="form-control"
              min="1"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Téléphone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-control"
              placeholder="Ex: +33612345678"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="address">Adresse</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="form-control"
            placeholder="Ville, Pays"
          />
        </div>

        <h3>Liens professionnels</h3>

        <div className="form-group">
          <label htmlFor="website">Site Web</label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="form-control"
            placeholder="https://votre-site.com"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="github">GitHub</label>
            <input
              type="url"
              id="github"
              name="github"
              value={formData.github}
              onChange={handleChange}
              className="form-control"
              placeholder="https://github.com/username"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="linkedin">LinkedIn</label>
            <input
              type="url"
              id="linkedin"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              className="form-control"
              placeholder="https://linkedin.com/in/username"
            />
          </div>
        </div>

        <div className="form-actions">
          <Button 
            type="button" 
            variant="secondary"
            onClick={() => navigate('/profile')}
          >
            Annuler
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            disabled={saving}
          >
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
