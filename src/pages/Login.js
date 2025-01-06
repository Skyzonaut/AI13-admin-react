import React, { useContext, useState } from 'react';
import { replace, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import { authService } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ pseudo: '', password: '' });
  const [error, setError] = useState('');
  const { setLoginConf } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    
      authService.login(credentials)
      .then((res) => {
        setLoginConf(res.token, res.user)
        console.log("redirect")
        navigate('/', {replace: true});
      })
      .catch((err) => {
        setError('Identifiants invalides');
      })
    
  };

  return (
    <div className="login-page">
        <h2>Connexion</h2>
        <div className="form-group">
          <label>Pseudo</label>
          <input
            type="text"
            value={credentials.pseudo}
            onChange={(e) => setCredentials({...credentials, pseudo: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Mot de passe</label>
          <input
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
          />
        </div>
        <h5 className="display-15" style={{color:"red"}}><i>{error}</i></h5>
        <button type="submit" onClick={handleSubmit}>Se connecter</button>
    </div>
  );
};

export default Login;