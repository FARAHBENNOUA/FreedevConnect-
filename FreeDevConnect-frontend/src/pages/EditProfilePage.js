import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import axios from 'axios';
import '../styles/pages/editprofile.css';

const EditProfilePage = () => {
  const { user: contextUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    city: '',
    country: '',
    bio: '',
    profilePhoto: ''
  });

  useEffect(() => {
    if (!isAuthenticated || !contextUser) {
      navigate('/login');
      return;
    }

    setFormData({
      firstName: contextUser.firstName || '',
      lastName: contextUser.lastName || '',
      email: contextUser.email || '',
      phoneNumber: contextUser.phoneNumber || '',
      city: contextUser.city || '',
      country: contextUser.country || '',
      bio: contextUser.bio || '',
      profilePhoto: contextUser.profilePhoto || ''
    });

    setPreviewImage(contextUser.profilePhoto || null);
  }, [isAuthenticated, contextUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ✅ UPLOAD IMAGE VIA BACKEND
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addNotification('❌ Veuillez sélectionner une image', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addNotification('❌ L\'image ne doit pas dépasser 5MB', 'error');
      return;
    }

    setUploading(true);

    try {
      const token = localStorage.getItem('token');
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const response = await axios.post(
        'http://localhost:8889/api/upload/upload',
        formDataUpload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      const imageUrl = response.data.url;
      
      setFormData(prev => ({
        ...prev,
        profilePhoto: imageUrl
      }));
      
      setPreviewImage(imageUrl);
      addNotification('✅ Photo uploadée avec succès !', 'success');
    } catch (error) {
      console.error('❌ Erreur upload:', error);
      addNotification('❌ Erreur lors de l\'upload de l\'image', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.put(
        'http://localhost:8889/api/users/profile',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log('✅ Profil mis à jour:', response.data);

      const updatedUser = { ...contextUser, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      addNotification('✅ Profil mis à jour avec succès !', 'success');
      navigate('/profile');
    } catch (error) {
      console.error('❌ Erreur mise à jour profil:', error);
      addNotification('❌ Erreur lors de la mise à jour du profil', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!contextUser) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-container">
        <h1>✏️ Modifier mon profil</h1>

        <form onSubmit={handleSubmit}>
          {/* Photo de profil */}
          <div className="profile-photo-section">
            <div className="photo-preview">
              {previewImage ? (
                <img src={previewImage} alt="Profil" />
              ) : (
                <div className="photo-placeholder">
                  {contextUser.firstName?.[0]}{contextUser.lastName?.[0]}
                </div>
              )}
            </div>
            
            <div className="photo-upload">
              <label htmlFor="photo-upload" className="btn-upload">
                {uploading ? '⏳ Upload...' : '📷 Changer la photo'}
              </label>
              <input
                type="file"
                id="photo-upload"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                style={{ display: 'none' }}
              />
              <small>JPG, PNG ou GIF - Max 5MB</small>
            </div>
          </div>

          {/* Reste du formulaire identique... */}
          <div className="form-section">
            <h2>📋 Informations personnelles</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">Prénom *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Nom *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                readOnly
                style={{ background: '#f0f0f0' }}
              />
              <small>L'email ne peut pas être modifié</small>
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">Téléphone</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+33612345678"
                disabled={loading}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">Ville</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Paris"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="country">Pays</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="France"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="bio">Biographie</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                placeholder="Parlez-nous de vous..."
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate('/profile')}
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn-save"
              disabled={loading || uploading}
            >
              {loading ? '⏳ Enregistrement...' : '💾 Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;