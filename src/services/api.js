const API_URL = 'http://localhost:8081/api';

export const authService = {
  login: async (credentials) => {
    return fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include', // Ajoutez cette ligne
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json' 
        },
        body: JSON.stringify({ "pseudo":credentials.pseudo, "password":credentials.password }),
    })
    .then((res) => {
        if(!res.ok) {
            const errorMessage = res.text();
            throw new Error(errorMessage || `HTTP error! status: ${res.status}`);
        }
        return res.json();
    })
    .then((data) => {
        return data;
    })
    .catch((err) => {
        console.error(err.message);
        throw new Error(err.message)
    });
  }
}

export const userService = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Erreur de récupération des utilisateurs');
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  create: async (userData) => {
    try {
      const response = await fetch(`${API_URL}/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify(userData)
      });
      if (!response.ok) throw new Error('Erreur de création');
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  update: async (id, userData) => {
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify(userData)
      });
      if (!response.ok) throw new Error('Erreur de mise à jour');
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Utilisateur non trouvé');
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },
  activate: async (id) => {
    await fetch(`${API_URL}/users/${id}/activate`, { 
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }});
  },
  desactivate: async (id) => {
    await fetch(`${API_URL}/users/${id}/deactivate`, { 
      method: 'PATCH', 
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    }});
  },
  updatePassword: async (id, password) => {
    try {
      const response = await fetch(`${API_URL}/users/${id}/password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: password
      });
      
      if (!response.ok) throw new Error('Erreur lors de la mise à jour du mot de passe');
      
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export const reponsesService = {
  getByQuestion: async (idQuestion) => {
    try {
      const response = await fetch(`${API_URL}/reponse/${idQuestion}`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Erreur de récupération des réponses de la question ' + idQuestion);
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
export const questionnaireService = {
  getAll: async () => {
    try {
      const response = await fetch(`http://localhost:8081/api/questionnaires/`, {
        method: "GET",
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          // 'Accept': "*/*",
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            // 'Content-Type': 'text/plain',
          // "Access-Control-Allow-Origin:": "*"
        }
      });
      console.log(response)
      if (!response.ok) throw new Error('Erreur de récupération des questionnaires');
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  edit: async (questionnaireData) => {
    try {
      const response = await fetch(`${API_URL}/questionnaires/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify(questionnaireData)
      });
      if (!response.ok) throw new Error('Erreur de création');
      const result = await response.json();

      let payload = [];
      questionnaireData.questions.forEach(question => {
        if(question.id < 0) question.id = null
        question.reponses?.forEach(reponse => {
          if(reponse.id < 0) reponse.id = null;
          payload.push(reponse)
        });
      });
      payload.sort((a, b) => {
        if (a.id === null && b.id !== null) {
          return 1;  // a va après b
        } else if (a.id !== null && b.id === null) {
          return -1; // b va après a
        }
        return 0;  // L'ordre reste le même si les deux sont égaux (null ou non null)
      });
      await fetch(`${API_URL}/reponse/push/reponses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      }).then((res) => {
        window.location.reload();
      })
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  create: async (questionnaireData) => {
    try {

      let payload = [];
      const dict = {}

      questionnaireData.questions.forEach(question => {
        if(question.id < 0) question.id = null
        question.reponses?.forEach(reponse => {
          if(reponse.id < 0) reponse.id = null;
          dict[reponse.text] = question.titre;
          payload.push(reponse)
        });
      });

      const response = await fetch(`${API_URL}/questionnaires/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify(questionnaireData)
      });
      if (!response.ok) throw new Error('Erreur de création');
      const result = await response.json();
      
      payload.forEach((rep) => {
        rep.questionId = result.questions.filter(el => el.titre === dict[rep.text])[0].id
      })

      fetch(`${API_URL}/reponse/push/reponses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      })
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  update: async (id, questionnaireData) => {
    try {
      const response = await fetch(`${API_URL}/questionnaires/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify(questionnaireData)
      });
      if (!response.ok) throw new Error('Erreur de mise à jour');
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/questionnaires/${id}`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Questionnaire non trouvé');
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  deleteReponses: async (list) => {
    try {
      list.forEach(async (rep) => {
        if(rep >= 0 && rep != null) {
          await fetch(`${API_URL}/reponses/${rep.id}`, {
            method: "DELETE",
            headers: {
              'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
          });
        }
      })
    } catch (error) {
      throw new Error(error.message);
    }
  },

  deleteQuestionnaire: async (id) => {

    fetch(`${API_URL}/questionnaires/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    })
  }
};