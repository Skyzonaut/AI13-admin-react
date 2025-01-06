import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { userService } from '../../services/api';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const activate = async (id) => {
    try {
      await userService.activate(id); // Appel au backend
      // Mise à jour locale des utilisateurs
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, isActive: true } : user
        )
      );
    } catch (error) {
      console.error(`Erreur lors de l'activation de l'utilisateur ${id}:`, error);
    }
  };

  // Fonction pour désactiver un utilisateur
  const desactivate = async (id) => {
    try {
      await userService.desactivate(id); // Appel au backend
      // Mise à jour locale des utilisateurs
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, isActive: false } : user
        )
      );
    } catch (error) {
      console.error(`Erreur lors de la désactivation de l'utilisateur ${id}:`, error);
    }
    console.log(users)
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="user-list">
      <div className="header">
        <h1>Utilisateurs</h1>
        <Link to="/users/create/" className="btn btn-success btn-add">
          Nouvel utilisateur
        </Link>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.nom}</td>
              <td>{user.prenom}</td>
              <td>{user.mail}</td>
              <td>
                <NavLink to={`/users/edit/${user.id}`} className="btn btn-primary btn-sm">
                  Modifier
                </NavLink>
                {user.isActive 
                  ? <a onClick={() => desactivate(user.id)} style={{height:"3.3vh",verticalAlign:"middle",paddingTop:'4px'}} className='ms-3 btn btn-danger btn-sm'>Désactiver</a>
                  : <a onClick={() => activate(user.id)} style={{height:"3.3vh",verticalAlign:"middle",paddingTop:'4px'}} className='ms-3 btn btn-warning btn-sm'>Activer</a>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table> 
    </div>
  );
};

export default UserList;