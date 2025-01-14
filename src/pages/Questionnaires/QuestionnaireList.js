import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { questionnaireService } from '../../services/api';

const QuestionnaireList = () => {
  const navigate = useNavigate();
  const [questionnaires, setQuestionnaires] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuestionnaires();
  }, []);

  const loadQuestionnaires = async () => {
    try {
      const data = await questionnaireService.getAll();
      setQuestionnaires(data);
      console.log(data)
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteQuestionnaire = async (id) => {
    questionnaireService.deleteQuestionnaire(id);
    const updatedQuestionnaires = questionnaires.filter(
      (questionnaire) => questionnaire.id !== id
    );
    setQuestionnaires(updatedQuestionnaires);
  }

  if (loading) return <div>Chargement...</div>;

  return (

      <div className="questionnaire-list">
        <div className="header d-flex justify-content-between align-items-center mb-3">
          <h1>Questionnaires</h1>
          <Link to="/questionnaires/create" className="btn btn-primary">
            Nouveau questionnaire
          </Link>
        </div>

        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Titre</th>
              <th scope="col">Nombre de questions</th>
              <th scope="col">Actions</th>
              <th scope='col'>Activé</th>
            </tr>
          </thead>
          <tbody>
            {questionnaires.map((questionnaire) => (
              <tr key={questionnaire.id}>
                <td>{questionnaire.titre}</td>
                <td>{questionnaire.questions?.length || 0}</td>
                <td>
                  <Link to={`/questionnaires/edit/${questionnaire.id}`} className="btn btn-warning btn-sm">
                    Modifier
                  </Link>
                  <a 
                    onClick={() => deleteQuestionnaire(questionnaire.id)} 
                    style={{height:"4.5vh",verticalAlign:"middle",paddingTop:'4px'}} 
                    className='ms-3 btn btn-danger btn-sm'>
                    Supprimer
                  </a>
                </td>
                <td>{questionnaire.enabled ? "Activé" : "Désactivé"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  );
};

export default QuestionnaireList;