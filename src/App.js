import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './Context/ProtectedRoute';
import { AuthProvider } from './Context/AuthContext';
import UserList from './pages/Users/UserList';
import QuestionnaireList from './pages/Questionnaires/QuestionnaireList';
import QuestionnaireEdit from './pages/Questionnaires/QuestionnaireEdit';
import QuestionnaireCreate from './pages/Questionnaires/CreateQuestionnaire';
import UserEdit from './pages/Users/UserEdit';
import UserCreate from './pages/Users/UserCreate';

// ... autres imports

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />} >
            <Route index element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />  
            <Route path='questionnaires' element={<ProtectedRoute><QuestionnaireList /></ProtectedRoute>}></Route>
            <Route path="questionnaires/edit/:id" element={<ProtectedRoute><QuestionnaireEdit /></ProtectedRoute>} />
            <Route path="questionnaires/create/" element={<ProtectedRoute><QuestionnaireCreate /></ProtectedRoute>} />
            <Route path='users' element={<ProtectedRoute><UserList /></ProtectedRoute>}></Route>
            <Route path='users/edit/:id' element={<ProtectedRoute><UserEdit /></ProtectedRoute>}></Route>
            <Route path='users/create/' element={<ProtectedRoute><UserCreate /></ProtectedRoute>}></Route>
          </Route>
          <Route path="*" element={<Login />}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;