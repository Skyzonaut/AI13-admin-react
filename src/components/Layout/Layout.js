import React from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import Header from '../shared/Header';
const Layout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="layout">
      {/* <nav className="sidebar">
        <h1 className="logo">Admin Panel</h1>
        <div className="nav-links">
          <NavLink to="/questionnaires">Questionnaires</NavLink>
          <NavLink to="/users">Utilisateurs</NavLink>
        </div>
        <button onClick={handleLogout} className="logout-btn btn btn-outline-danger">
          Déconnexion
        </button>
      </nav> */}
      
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;