// src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// --- Pages ---
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SchoolDashboard from './pages/SchoolDashboard';
import StudentDashboard from './pages/StudentDashboard';
import CreateConventionPage from './pages/CreateConventionPage';
import CompanyCompletionPage from './pages/CompanyCompletionPage';
import SignConventionPage from './pages/SignConventionPage'; // <-- NOUVEL IMPORT

// --- Composants ---
import ProtectedRoute from './components/ProtectedRoute';

/**
 * C'est le routeur principal de l'application.
 * Il définit quelle page est affichée pour chaque URL.
 */
function App() {
  return (
    <div className="App">
      <Routes>
        {/* --- Routes Publiques --- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/complete/:token" element={<CompanyCompletionPage />} />
        <Route path="/" element={<LoginPage />} />

        {/* --- Routes Protégées --- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<SchoolDashboard />} />
          <Route path="/dashboard-etudiant" element={<StudentDashboard />} />
          <Route path="/convention/nouveau" element={<CreateConventionPage />} />
          <Route path="/convention/:id" element={<SignConventionPage />} /> {/* <-- MISE À JOUR ICI */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;