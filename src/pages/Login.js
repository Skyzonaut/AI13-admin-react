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


  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Empêche le comportement par défaut du navigateur
      handleSubmit(e); // Appelle la fonction de soumission
    }
  };

  return (
    <div className="login-page">
        <h1>Portail Administrateur</h1>
        <h4>Connexion</h4>
        <form>
          <div className="form-group">
            <label>Pseudo</label>
            <input
              data-bs-theme="dark" 
              className="form-control"
              type="text"
              value={credentials.pseudo}
              style={{borderWidth:"1px",borderColor:"grey"}}
              onChange={(e) => setCredentials({...credentials, pseudo: e.target.value})}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <input
              data-bs-theme="dark" 
              type="password"
              className="form-control"
              value={credentials.password}
              style={{borderWidth:"1px",borderColor:"grey"}}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              onKeyDown={handleKeyDown}
            />
          </div>
          <h5 className="display-15" style={{color:"red"}}><i>{error}</i></h5>
          
          <inputButton 
              data-bs-theme="dark" 
              className="form-control"
              style={{width: '6vw', textAlign:"center"}}
              onClick={handleSubmit}>Login
          </inputButton>
        </form>
    </div>
  );
};

export default Login;