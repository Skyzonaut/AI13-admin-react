import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/shared/Header';
// import '/styles/Dashboard.scss';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <h1>Tableau de bord</h1>
        
        <div className="dashboard-cards">
          <div 
            className="dashboard-card"
            onClick={() => navigate('/questionnaires')}
          >
            <h2>Questionnaires</h2>
            <p>Gérer les questionnaires</p>
          </div>

          <div 
            className="dashboard-card"
            onClick={() => navigate('/users')}
          >
            <h2>Utilisateurs</h2>
            <p>Gérer les utilisateurs</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;