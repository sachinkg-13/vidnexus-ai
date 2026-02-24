import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthContainer from './pages/AuthContainer';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import NoteDetail from './pages/NoteDetail';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes with sliding animation */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <AuthContainer />
            </PublicRoute>
          } 
        />
        <Route 
          path="/signup" 
          element={
            <PublicRoute>
              <AuthContainer />
            </PublicRoute>
          } 
        />
        
        {/* Landing Page - Always accessible */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Protected Routes - Require authentication */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes/:id"
          element={
            <ProtectedRoute>
              <NoteDetail />
            </ProtectedRoute>
          }
        />
        
        {/* 404 - Catch all unmatched routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
