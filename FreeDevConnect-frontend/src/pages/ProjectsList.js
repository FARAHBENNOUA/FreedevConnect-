import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'; // ← Ajoutez ceci
import { api } from '../api/config';
import ProjectCard from '../components/projects/ProjectCard';
import '../styles/pages/projects.css';

const ProjectsList = () => {
  const [searchParams] = useSearchParams(); // ← Ajoutez ceci
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchQuery = searchParams.get('search') || ''; // ← Ajoutez ceci

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        
        // Construire l'URL avec ou sans recherche
        const url = searchQuery 
          ? `/projects?search=${encodeURIComponent(searchQuery)}`
          : '/projects';
        
        console.log('🌐 Appel API:', `${process.env.REACT_APP_API_URL}${url}`);
        
        const response = await api.get(url);
        console.log('✅ Réponse API complète:', response);
        console.log('📊 Données reçues:', response.data);
        
        // Vérifier différents formats de réponse
        let projectsData = [];
        if (Array.isArray(response.data)) {
          projectsData = response.data;
        } else if (response.data.projects) {
          projectsData = response.data.projects;
        } else if (response.data.data) {
          projectsData = response.data.data;
        }
        
        console.log('📋 Projets extraits:', projectsData);
        setProjects(projectsData);
        setError(null);
        
      } catch (error) {
        console.error('❌ Erreur API détaillée:', error);
        console.error('❌ Response:', error.response);
        console.error('❌ Status:', error.response?.status);
        console.error('❌ Data:', error.response?.data);
        
        setError(`Erreur API: ${error.response?.status || 'Connexion impossible'}`);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [searchQuery]); // ← Ajoutez searchQuery ici

  if (loading) {
    return <div className="loading-container">Chargement des projets...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>❌ Erreur de connexion à votre API</h3>
        <p>{error}</p>
        <p>Vérifiez que votre backend sur le port 8889 est démarré</p>
        <button onClick={() => window.location.reload()}>Réessayer</button>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="empty-container">
        <h3>
          {searchQuery 
            ? `Aucun projet trouvé pour "${searchQuery}"` 
            : 'Aucun projet dans votre base de données'}
        </h3>
        <p>
          {searchQuery 
            ? 'Essayez une autre recherche' 
            : 'Ajoutez des projets via votre backend'}
        </p>
      </div>
    );
  }

  return (
    <div className="projects-list-container">
      <h1>
        {searchQuery 
          ? `Résultats pour "${searchQuery}" (${projects.length})` 
          : `Projets disponibles (${projects.length})`}
      </h1>
      <div className="projects-grid">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default ProjectsList;