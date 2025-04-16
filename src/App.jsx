// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home/Home';
//import Dashboard from './pages/Dashboard';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ProtectedRoute from './components/common/ProtectedRoute';
import { UserProvider } from './Hooks/Auth';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import QuickBuyCard from './components/ui/QuickBuyCard';
import Profil from './components/layout/Profil';
import Admin from './components/layout/Admin';
import ProtectedRouteAdmin from './components/common/ProtectedRouteAdmin';


export default function App() {
  return (
    <BrowserRouter>
    <UserProvider>
      <Routes>
        <Route path="/connexion" element={<Login />} />
        <Route path="/inscription" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin" element={<ProtectedRouteAdmin><Admin /></ProtectedRouteAdmin>} />

        <Route path="/" element={<HomePage />} />
        
        {/* Ou pour des routes imbriquées */}
        <Route path="/achat" element={<ProtectedRoute><QuickBuyCard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profil /></ProtectedRoute>} />
      </Routes>
    </UserProvider>
    </BrowserRouter>
  );
}
