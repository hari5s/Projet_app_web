import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx'; // <-- IMPORTER

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Le AuthProvider doit être à l'extérieur du BrowserRouter
        pour que les routes puissent accéder au contexte */}
    <AuthProvider>  {/* <-- AJOUTER */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider> {/* <-- AJOUTER */}
  </React.StrictMode>
);