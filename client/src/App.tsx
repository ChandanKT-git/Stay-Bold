import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ListingDetail from './pages/ListingDetail';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HostDashboard from './pages/HostDashboard';
import CreateListing from './pages/CreateListing';
import BookingsPage from './pages/BookingsPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router 
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/listing/:id" element={<ListingDetail />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route 
                path="/bookings" 
                element={
                  <ProtectedRoute>
                    <BookingsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/host/dashboard" 
                element={
                  <ProtectedRoute requireHost>
                    <HostDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/host/create-listing" 
                element={
                  <ProtectedRoute requireHost>
                    <CreateListing />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;