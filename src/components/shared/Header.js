import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
// import 'admin-app/src/styles/Header.scss';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  return (
    // <header className="header">
    //   <div className="header-left">
    //     <button 
    //       onClick={() => navigate('/questionnaires')}
    //       className="header-button"
    //     >
    //       Questionnaires
    //     </button>
    //     <button 
    //       onClick={() => navigate('/users')}
    //       className="header-button"
    //     >
    //       Utilisateurs
    //     </button>
    //   </div>
    //   <div className="header-right">
    //     <button 
    //       onClick={handleLogout}
    //       className="header-button logout"
    //     >
    //       Déconnexion
    //     </button>
    //   </div>
    // </header>
     <nav className="sidebar">
        <h1 className="logo">Admin Panel</h1>
        <div className="nav-links">
          <NavLink to="/questionnaires">Questionnaires</NavLink>
          <NavLink to="/users">Utilisateurs</NavLink>
        </div>
        <button onClick={handleLogout} className="logout-btn btn btn-danger">
          Déconnexion
        </button>
      </nav> 
  );
};

export default Header;