import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SchoolDashboard from './pages/SchoolDashboard';
import StudentDashboard from './pages/StudentDashboard';
import CreateConventionPage from './pages/CreateConventionPage';
import StudentCompletionPage from './pages/StudentCompletionPage';
import CompanyCompletionPage from './pages/CompanyCompletionPage';
import SignConventionPage from './pages/SignConventionPage';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* --- Routes Publiques --- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<LoginPage />} />

        {/* --- Routes Protégées --- */}
        <Route element={<ProtectedRoute />}>
          {/* Les dashboards et la page de signature, accessibles à tous les rôles connectés */}
          <Route path="/dashboard-etudiant" element={<StudentDashboard />} />
          <Route path="/convention/:id" element={<SignConventionPage />} />

          {/* Les pages de complétion sont maintenant protégées ! */}
          <Route path="/complete-student/:token" element={<StudentCompletionPage />} />
          <Route path="/complete-company/:token" element={<CompanyCompletionPage />} />
          
          {/* Routes accessibles UNIQUEMENT aux Écoles */}
          <Route element={<ProtectedRoute allowedRoles={['School']} />}>
            <Route path="/dashboard" element={<SchoolDashboard />} />
            <Route path="/convention/nouveau" element={<CreateConventionPage />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;