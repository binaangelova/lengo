import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

// Protected route for regular users
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Protected route for admin users
const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  return isAuthenticated && user?.role === 'admin' ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* User Routes */}
            <Route path="/" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
            <Route path="/lessons" element={<ProtectedRoute><Lessons /></ProtectedRoute>} />
            <Route path="/lesson/:levelId/:lessonName" element={<LessonTemplate />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/test-results/:testResultId" element={<TestResults />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedAdminRoute><Admin /></ProtectedAdminRoute>} />
            <Route path="/admin/users" element={<ProtectedAdminRoute><Users /></ProtectedAdminRoute>} />
            <Route path="/admin/add-lesson" element={<ProtectedAdminRoute><AddLesson /></ProtectedAdminRoute>} />
            <Route path="/admin/lesson-editor" element={<ProtectedAdminRoute><LessonEditor /></ProtectedAdminRoute>} />
            <Route path="/admin/user-details/:userId" element={<ProtectedAdminRoute><UserDetail /></ProtectedAdminRoute>} />
            <Route path="/admin/lessons/:levelId/:lessonName" element={<ProtectedAdminRoute><AdminLessonTemplate /></ProtectedAdminRoute>} />
            <Route path="/admin/edit-lesson/:lessonId" element={<ProtectedAdminRoute><EditLesson /></ProtectedAdminRoute>} />
            <Route path="/admin/admin-test-results/:testResultId" element={<ProtectedAdminRoute><AdminTestResults /></ProtectedAdminRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;