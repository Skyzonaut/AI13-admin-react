import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/api';

const UserCreate = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [passwordError, setPasswordError] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [user, setUser] = useState({
    pseudo: '',
    nom: '',
    prenom: '',
    mail: '',
    company: '',
    phone: '',
    password: '',
    isActive: true,
    manager: null,
    role: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'passwordConfirm') {
      setPasswordConfirm(value);
      setPasswordError('');
    } else {
      setUser(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
      if (name === 'password') {
        setPasswordError('');
      }
    }
  };

  const validatePasswords = () => {
    if (user.password !== passwordConfirm) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return false;
    }
    if (user.password.length < 6) {
      setPasswordError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setPasswordError('');

    if (!validatePasswords()) {
      return;
    }

    try {
      const userToCreate = {
        ...user,
        password: user.password
      };
      await userService.create(userToCreate);
      navigate('/users');
    } catch (err) {
      setError('Erreur lors de la création de l\'utilisateur');
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Créer un utilisateur</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Pseudo</label>
          <input
            type="text"
            className="form-control"
            name="pseudo"
            value={user.pseudo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="mail"
            value={user.mail}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Mot de passe</label>
          <input
            type="password"
            className={`form-control ${passwordError ? 'is-invalid' : ''}`}
            name="password"
            value={user.password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Confirmer le mot de passe</label>
          <input
            type="password"
            className={`form-control ${passwordError ? 'is-invalid' : ''}`}
            name="passwordConfirm"
            value={passwordConfirm}
            onChange={handleChange}
            required
          />
          {passwordError && (
            <div className="invalid-feedback">
              {passwordError}
            </div>
          )}
        </div>

        <div className="col-md-6">
          <label className="form-label">Nom</label>
          <input
            type="text"
            className="form-control"
            name="nom"
            value={user.nom}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Prénom</label>
          <input
            type="text"
            className="form-control"
            name="prenom"
            value={user.prenom}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Entreprise</label>
          <input
            type="text"
            className="form-control"
            name="company"
            value={user.company}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Téléphone</label>
          <input
            type="tel"
            className="form-control"
            name="phone"
            value={user.phone}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Manager</label>
          <input disabled
            type="text"
            className="form-control"
            name="manager"
            value={user.manager}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Rôle</label>
          <select
            className="form-select"
            name="role"
            value={user.role}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionner un rôle</option>
            <option value="ADMIN">Administrateur</option>
            <option value="USER">Utilisateur</option>
          </select>
        </div>

        <div className="col-12">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              name="isActive"
              checked={user.isActive}
              onChange={handleChange}
              id="isActive"
            />
            <label className="form-check-label" htmlFor="isActive">
              Compte actif
            </label>
          </div>
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-success me-2">
            Créer
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/users')}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserCreate;