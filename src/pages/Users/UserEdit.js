import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { userService } from '../../services/api';

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [passwordError, setPasswordError] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [passwordData, setPasswordData] = useState({
    password: '',
    passwordConfirm: ''
  });
  const [user, setUser] = useState({
    pseudo: '',
    nom: '',
    prenom: '',
    mail: '',
    company: '',
    phone: '',
    isActive: true,
    manager: '',
    role: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, [id]);

  const loadUser = async () => {
    try {
      const data = await userService.getById(id);
      setUser(data);
      setLoading(false);
    } catch (err) {
      setError('Erreur lors du chargement de l\'utilisateur');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    setPasswordError('');
  };

  const validatePasswords = () => {
    if (!showPasswordFields) return true;
    
    if (passwordData.password !== passwordData.passwordConfirm) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return false;
    }
    if (passwordData.password.length < 6) {
      setPasswordError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswords()) return;

    try {
      const userToUpdate = { ...user };
      if (showPasswordFields && passwordData.password) {
        userToUpdate.password = passwordData.password;
      }
      await userService.update(id, userToUpdate);
      navigate('/users');
    } catch (err) {
      setError('Erreur lors de la mise à jour');
    }
  };
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswords()) return;
  
    try {
      await userService.updatePassword(id, passwordData.password);
      setShowPasswordFields(false);
      setPasswordData({ password: '', passwordConfirm: '' });
      setPasswordError('');
      // Optionnel : afficher un message de succès
    } catch (err) {
      setPasswordError('Erreur lors de la mise à jour du mot de passe');
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Modifier l'utilisateur</h1>
      
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
          <input
          disabled
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
            <option value="TRAINEE">Utilisateur</option>
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
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => setShowPasswordFields(!showPasswordFields)}
          >
            {showPasswordFields ? 'Annuler le changement de mot de passe' : 'Changer le mot de passe'}
          </button>
        </div>

        {showPasswordFields && (
          <div className="col-12 border p-3 mt-3">
            <h4>Changer le mot de passe</h4>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Nouveau mot de passe</label>
                <input
                  type="password"
                  className={`form-control ${passwordError ? 'is-invalid' : ''}`}
                  name="password"
                  value={passwordData.password}
                  onChange={handlePasswordChange}
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
                  value={passwordData.passwordConfirm}
                  onChange={handlePasswordChange}
                  required
                />
                {passwordError && (
                  <div className="invalid-feedback">
                    {passwordError}
                  </div>
                )}
              </div>

              <div className="col-12">
                <button
                  type="button"
                  className="btn btn-primary me-2"
                  onClick={handlePasswordSubmit}
                >
                  Mettre à jour le mot de passe
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowPasswordFields(false);
                    setPasswordData({ password: '', passwordConfirm: '' });
                    setPasswordError('');
                  }}
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            )}


        <div className="col-12">
          <button type="submit" className="btn btn-primary me-2">
            Enregistrer
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

export default UserEdit;