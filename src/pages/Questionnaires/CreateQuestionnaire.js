import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { questionnaireService } from '../../services/api';

const QuestionnaireCreate = () => {
  const navigate = useNavigate();
  const [questionnaire, setQuestionnaire] = useState({
    id: null,
    titre: '',
    questions: []
  });

  const addQuestion = () => {
    const newQuestion = {
      id: -(questionnaire.questions.length + 1), // ID négatif temporaire
      titre: '',
      enabled: true,
      ordre: questionnaire.questions.length + 1,
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
        const newReponse = {
          id: -(q.reponses.length + 1), // ID négatif temporaire
          text: '',
          vrai: false,
          questionId: q.id,
          ordre: q.reponses.length + 1
        };
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
    questionnaireService.create(questionnaire)
      .then(() => {
        navigate('/questionnaires');
      })
      .catch(error => {
        console.error('Erreur lors de la création:', error);
      });
  };

  return (
    <div className="container mt-4">
      <h1 className="d-flex justify-content-between align-items-center">
        <input
          type="text"
          className="form-control"
          placeholder="Titre du questionnaire"
          value={questionnaire.titre}
          onChange={(e) => setQuestionnaire({ ...questionnaire, titre: e.target.value })}
          style={{ maxWidth: '500px' }}
        />
        <button
          onClick={save}
          className="btn btn-success ms-auto"
          style={{ marginRight: '2px' }}
        >
          Créer
        </button>
      </h1>

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
                  className='form-control'
                  type="text"
                  value={question.titre}
                  onChange={(e) => handleQuestionChange(question.id, 'titre', e.target.value)}
                  placeholder="Titre de la question"
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
        <div key={question.id} className="mb-4">
          <h4 className="d-flex justify-content-between align-items-center">
            {question.titre || 'Nouvelle question'}
            <button
              onClick={() => addReponse(question.id)}
              className="btn btn-outline-success ms-auto"
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
                      className='form-control'
                      onChange={(e) => handleReponseChange(question.id, reponse.id, 'text', e.target.value)}
                      placeholder="Texte de la réponse"
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={reponse.vrai}
                      className='form-check-input'
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

export default QuestionnaireCreate;