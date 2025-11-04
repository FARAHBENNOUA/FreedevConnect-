import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import ProjectDetails from '../components/projects/ProjectDetails';
import '../styles/pages/projects.css';

const ProjectPage = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simuler le chargement des données du projet
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Projet fictif
        const dummyProject = {
          id: Number(id),
          title: 'Développement d\'un site e-commerce',
          description: 'Création d\'un site e-commerce complet avec panier, système de paiement et gestion des commandes. Le site doit permettre aux utilisateurs de parcourir les produits, de les ajouter au panier, de passer commande et de suivre leurs livraisons. Le design devra être responsive et moderne.\n\nTechnologies requises :\n- Front-end: React.js avec Redux\n- Back-end: Node.js avec Express\n- Base de données: MongoDB\n- Paiement: Intégration de Stripe\n\nLivrables attendus :\n- Code source complet\n- Documentation technique\n- Guide d\'utilisation',
          budget: 3000,
          skills: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Redux'],
          deadline: '2023-10-15',
          clientName: 'Entreprise ABC',
          clientId: 123,
          clientRating: 4,
          postedDate: '2023-08-01',
          applicationsCount: 5
        };
        
        setProject(dummyProject);
        
        // Vérifier si l'utilisateur a déjà postulé (simulé)
        if (currentUser?.role === 'freelance') {
          setHasApplied(Math.random() > 0.7); // Simuler aléatoirement
        }
        
      } catch (error) {
        console.error('Erreur lors du chargement du projet:', error);
        setError('Impossible de charger le projet');
      } finally {
        setLoading(false); // IMPORTANT: TOUJOURS ARRÊTER LE LOADING
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id, currentUser]);

  const handleApply = () => {
    if (!currentUser) {
      addNotification('Veuillez vous connecter pour postuler', 'warning');
      navigate('/login');
      return;
    }
    
    if (currentUser.role !== 'freelance') {
      addNotification('Seuls les freelances peuvent postuler aux projets', 'error');
      return;
    }
    
    // Rediriger vers le formulaire de candidature
    navigate(`/freelance/application/${id}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Chargement du projet...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Erreur</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/projects')}>Retour aux projets</button>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="error-container">
        <h2>Projet introuvable</h2>
        <p>Le projet demandé n'existe pas ou a été supprimé.</p>
        <button onClick={() => navigate('/projects')}>Retour aux projets</button>
      </div>
    );
  }

  const isClient = currentUser?.role === 'client';
  const isOwner = isClient && currentUser?.id === project.clientId;

  return (
    <div className="project-page">
      <ProjectDetails 
        project={project}
        onApply={handleApply}
        isClient={isClient}
        isOwner={isOwner}
        isApplied={hasApplied}
      />
    </div>
  );
};

export default ProjectPage;