import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api as apiClient } from '../../api/config';
import ProposalCard from './ProposalCard';
import '../../styles/components/cards.css';

const ProposalsList = () => {
  const { currentUser } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, applicationsRes] = await Promise.all([
          apiClient.get('/projects'),
          apiClient.get('/applications')
        ]);

        setProposals(projectsRes.data.projects || []);
        setApplications(applicationsRes.data.applications || []);
      } catch (error) {
        console.error('Erreur chargement données:', error);
      }
    };

    fetchData();
  }, []);

  const userApplications = currentUser
    ? applications.filter(app => app.userId === currentUser.id)
    : [];

  return (
    <div className="proposals-list">
      <h2>Projets disponibles</h2>
      {proposals.length === 0 ? (
        <p>Aucun projet disponible pour le moment.</p>
      ) : (
        proposals.map(proposal => (
          <ProposalCard
            key={proposal.id}
            proposal={proposal}
            hasApplied={userApplications.some(app => app.projectId === proposal.id)}
          />
        ))
      )}
    </div>
  );
};

export default ProposalsList;
