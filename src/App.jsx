
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import LandingPage from '@/pages/LandingPage';
import HomePage from '@/pages/HomePage';
import SignupPage from '@/pages/SignupPage';
import LoginPage from '@/pages/LoginPage';
import DiscoverPage from '@/pages/DiscoverPage';
import UserProfile from '@/pages/UserProfile';
import PricingPage from '@/pages/PricingPage';
import Dashboard from '@/pages/Dashboard';
import DestiniqueSwipePage from '@/pages/DestiniqueSwipePage';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminRoute from '@/components/AdminRoute';
import ProfileDetailView from '@/components/ProfileDetailView';
import AdminPanel from '@/pages/AdminPanel';

import SimpleTest from '@/pages/SimpleTest';

// In your routes section, add:
<Route path="/simple-test" element={<SimpleTest />} />


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          
          <Route path="/profile/:id" element={<ProfileDetailView />} />

          <Route
            path="/discover"
            element={
              <ProtectedRoute>
                <DiscoverPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/destinique-swipe"
            element={
              <ProtectedRoute>
                <DestiniqueSwipePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
