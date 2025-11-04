import React, { useState, useEffect } from 'react';
import ProjectCard from './ProjectCard';
import '../../styles/pages/projects.css';

const ProjectsList = ({ filters = {} }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler un chargement de données
    setTimeout(() => {
      // Projets fictifs
      const dummyProjects = [
        {
          id: 1,
          title: 'Développement d\'un site e-commerce',
          description: 'Création d\'un site e-commerce complet avec panier, système de paiement et gestion des commandes.',
          budget: 3000,
          skills: ['React', 'Node.js', 'MongoDB'],
          deadline: '2023-10-15',
          clientName: 'Entreprise ABC',
          clientRating: 4,
          postedDate: '2023-08-01'
        },
        {
          id: 2,
          title: 'Application mobile iOS et Android',
          description: 'Développement d\'une application mobile de livraison de repas pour iOS et Android.',
          budget: 5000,
          skills: ['React Native', 'Firebase', 'Redux'],
          deadline: '2023-11-30',
          clientName: 'FoodTech SAS',
          clientRating: 5,
          postedDate: '2023-08-05'
        },
        {
          id: 3,
          title: 'Refonte UI/UX d\'un tableau de bord',
          description: 'Modernisation de l\'interface d\'un tableau de bord administratif avec un design responsive.',
          budget: 1800,
          skills: ['UI/UX', 'Figma', 'HTML/CSS'],
          deadline: '2023-09-20',
          clientName: 'StartupXYZ',
          clientRating: 3,
          postedDate: '2023-08-10'
        }
      ];
      
      setProjects(dummyProjects);
      setLoading(false);
    }, 1000);
  }, [filters]);

  if (loading) {
    return <div className="loading-spinner">Chargement des projets...</div>;
  }

  if (projects.length === 0) {
    return (
      <div className="empty-projects">
        <h3>Aucun projet ne correspond à vos critères</h3>
        <p>Essayez de modifier vos filtres ou revenez plus tard</p>
      </div>
    );
  }

  return (
    <div className="projects-list-container">
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};

export default ProjectsList