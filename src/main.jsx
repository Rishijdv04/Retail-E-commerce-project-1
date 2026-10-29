import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import { Toaster } from 'sonner';

import App from './App.jsx';
import './styles.css';
import './styles/auth.css';

import { useAuth } from './store/authStore';
import RequireAuth from './components/auth/RequireAuth';
import { LoginPage, SignupPage, ForgotPasswordPage, AdminLoginPage } from './pages/auth/AuthPages';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/admin/AdminDashboard';

useAuth.getState().init();

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route element={<RequireAuth />}>
        <Route path="/account" element={<ProfilePage />} />
      </Route>
      <Route element={<RequireAuth roles={['admin']} loginPath="/admin/login" />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
    </Routes>
    <Toaster richColors position="top-right" />
  </BrowserRouter>
);