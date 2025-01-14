import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { questionnaireService, reponsesService } from '../../services/api';

const QuestionnaireEdit = () => {
  const { id } = useParams();
  const [questionnaire, setQuestionnaire] = useState(null);
  const [reponsesLoaded, setReponsesLoaded] = useState(false);
  const [idToDelete, setIdToDelete] = useState([])
  const navigate = useNavigate();

  useEffect(() => {
    loadQuestionnaire();
  }, [id]);

  // Charge le questionnaire depuis le service
  const loadQuestionnaire = async () => {
    await questionnaireService.deleteReponses(idToDelete)
    questionnaireService.getById(id)
      .then((data) => {
        setQuestionnaire(data);
        loadReponses(data.questions);  // Charge les réponses après avoir chargé le questionnaire
      })
      .catch((error) => {
        console.error('Erreur:', error);
      });
  };

  // Charge les réponses une fois le questionnaire chargé
  const loadReponses = async (questions) => {
    try {
      const updatedQuestions = await Promise.all(
        questions.map(async (question) => {
          const responses = await reponsesService.getByQuestion(question.id);
          return { ...question, reponses: responses };
        })
      );
      setQuestionnaire((prevQuestionnaire) => ({
        ...prevQuestionnaire,
        questions: updatedQuestions
      }));
      setReponsesLoaded(true);
    } catch (error) {
      console.error('Erreur lors du chargement des réponses:', error);
    }
  };

  const addQuestion = () => {
    const newQuestion = {
      id: questionnaire.questions.length + 1,
      titre: '',
      enabled: true,
      ordre: questionnaire.questions.length + 1,
      questionnaireId: questionnaire.id,
      reponses: []
    };
    setQuestionnaire({
      ...questionnaire,
      questions: [...questionnaire.questions, newQuestion]
    });
  };

  const deleteQuestion = (id) => {
    const updatedQuestions = questionnaire.questions.filter(q => q.id !== id);
    setQuestionnaire({ ...questionnaire, questions: updatedQuestions });
  };

  const handleQuestionChange = (id, key, value) => {
    const updatedQuestions = questionnaire.questions.map(q =>
      q.id === id ? { ...q, [key]: value } : q
    );
    setQuestionnaire({ ...questionnaire, questions: updatedQuestions });
  };

  const addReponse = (questionId) => {
    const updatedQuestions = questionnaire.questions.map(q => {
      if (q.id === questionId) {
        const newReponse = { id: -(q.reponses.length + 1), text: '', vrai: false, questionId: q.id, parcoursId: null, ordre: q.reponses.length + 1 };
        return { ...q, reponses: [...q.reponses, newReponse] };
      }
      return q;
    });
    setQuestionnaire({ ...questionnaire, questions: updatedQuestions });
  };

  const deleteReponse = (questionId, reponseId) => {
    const updatedQuestions = questionnaire.questions.map(q => {
      if (q.id === questionId) {
        const updatedReponses = q.reponses.filter(r => r.id !== reponseId);
        return { ...q, reponses: updatedReponses };
      }
      return q;
    });
    setIdToDelete([...idToDelete, reponseId])
    setQuestionnaire({ ...questionnaire, questions: updatedQuestions });
  };

  const handleReponseChange = (questionId, reponseId, key, value) => {
    const updatedQuestions = questionnaire.questions.map(q => {
      if (q.id === questionId) {
        const updatedReponses = q.reponses.map(r =>
          r.id === reponseId ? { ...r, [key]: value } : r
        );
        return { ...q, reponses: updatedReponses };
      }
      return q;
    });
    setQuestionnaire({ ...questionnaire, questions: updatedQuestions });
  };

  const save = () => {
    console.log(questionnaire)
    questionnaireService.edit(questionnaire)

  }

  if (!questionnaire || !reponsesLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          {questionnaire.titre}
        </div>
        <button
          onClick={save}
          className="btn btn-warning ms-auto"
          style={{ marginRight: '2px' }}
        >
          Enregistrer
        </button>
      </h1>
      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          id="questionnaireEnabled"
          checked={questionnaire.enabled}
          onChange={(e) => setQuestionnaire({
            ...questionnaire,
            enabled: e.target.checked
          })}
        />
        <label 
          className="form-check-label" 
          htmlFor="questionnaireEnabled"
        >
          {questionnaire.enabled ? 'Activé' : 'Désactivé'}
        </label>
      </div>
      <table className='table table-striped'>
        <thead>
          <tr>
            <th>Titre</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {questionnaire.questions.map((question) => (
            <tr key={question.id} className='quest-row'>
              <td>
                <input
                  className='input-group-text'
                  type="text"
                  value={question.titre}
                  onChange={(e) => handleQuestionChange(question.id, 'titre', e.target.value)}
                />
              </td>
              <td style={{ width: '10%' }}>
                <button onClick={() => deleteQuestion(question.id)} className='btn btn-danger'>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mb-3">
        <button onClick={addQuestion} className='btn btn-success'>Ajouter une question</button>
      </div>

      {questionnaire.questions.map((question) => (
        <div key={question.id}>
          <h4 className="d-flex justify-content-between align-items-center">
            {question.titre}
            <button
              onClick={() => addReponse(question.id)}
              className="btn btn-outline-success ms-auto"
              style={{ marginRight: '2px' }}
            >
              Ajouter une réponse
            </button>
          </h4>

          <table className='table table-striped'>
            <thead>
              <tr>
                <th>Texte</th>
                <th>Vrai</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {question.reponses.map((reponse) => (
                <tr key={reponse.id} className='quest-row'>
                  <td style={{ width: '70%' }}>
                    <input
                      type="text"
                      value={reponse.text}
                      className='input-group-text'
                      onChange={(e) => handleReponseChange(question.id, reponse.id, 'text', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={reponse.vrai}
                      className='input-group-text'
                      onChange={(e) => handleReponseChange(question.id, reponse.id, 'vrai', e.target.checked)}
                    />
                  </td>
                  <td>
                    <button className='btn btn-danger' onClick={() => deleteReponse(question.id, reponse.id)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default QuestionnaireEdit;
