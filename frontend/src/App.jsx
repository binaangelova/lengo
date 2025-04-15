import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import About from './pages/About';
import Lessons from './pages/Lessons';
import Profile from './pages/Profile';
import LessonTemplate from './pages/LessonTemplate';
import Admin from './pages/Admin';
import Users from './pages/Users';
import AddLesson from './pages/AddLesson';
import LessonEditor from './pages/LessonEditor';
import UserDetail from './pages/UserDetail';
import AdminLessonTemplate from './pages/AdminLessonTemplate';
import EditLesson from './pages/EditLesson';
import TestResults from './pages/TestResults';
import AdminTestResults from './pages/AdminTestResults';

const LoadingScreen = () => (
  <div className="bg-blue-100 min-h-screen flex items-center justify-center">
    <div className="text-2xl text-blue-900">Зареждане...</div>
  </div>
);

// Protected route for regular users
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Protected route for admin users
const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user?.role === 'admin') {
    return <Navigate to="/home" replace />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Register />} />
            <Route path="/login" element={<Login />} />

            {/* Protected User Routes */}
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
            <Route path="/lessons" element={<ProtectedRoute><Lessons /></ProtectedRoute>} />
            <Route path="/lesson/:levelId/:lessonName" element={<ProtectedRoute><LessonTemplate /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/test-results/:testResultId" element={<ProtectedRoute><TestResults /></ProtectedRoute>} />
            
            {/* Protected Admin Routes */}
            <Route path="/admin" element={<ProtectedAdminRoute><Admin /></ProtectedAdminRoute>} />
            <Route path="/admin/users" element={<ProtectedAdminRoute><Users /></ProtectedAdminRoute>} />
            <Route path="/admin/add-lesson" element={<ProtectedAdminRoute><AddLesson /></ProtectedAdminRoute>} />
            <Route path="/admin/lesson-editor" element={<ProtectedAdminRoute><LessonEditor /></ProtectedAdminRoute>} />
            <Route path="/admin/user-details/:userId" element={<ProtectedAdminRoute><UserDetail /></ProtectedAdminRoute>} />
            <Route path="/admin/lessons/:levelId/:lessonName" element={<ProtectedAdminRoute><AdminLessonTemplate /></ProtectedAdminRoute>} />
            <Route path="/admin/edit-lesson/:lessonId" element={<ProtectedAdminRoute><EditLesson /></ProtectedAdminRoute>} />
            <Route path="/admin/admin-test-results/:testResultId" element={<ProtectedAdminRoute><AdminTestResults /></ProtectedAdminRoute>} />

            {/* Catch-all route for 404 */}
            <Route path="*" element={
              <div className="bg-blue-100 min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl text-blue-900 mb-4">404 - Страницата не е намерена</h1>
                  <button 
                    onClick={() => navigate(-1)} 
                    className="bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-800 transition duration-200"
                  >
                    Назад
                  </button>
                </div>
              </div>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;