import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import About from './pages/About';
import Lessons from './pages/Lessons';
import Profile from './pages/Profile';
import LessonTemplate from './pages/LessonTemplate'; // Импортиране на LessonTemplate
import Admin from './pages/Admin';
import Users from './pages/Users';
import AddLesson from './pages/AddLesson';
import LessonEditor from './pages/LessonEditor';
import UserDetail from './pages/UserDetail';
import AdminLessonTemplate from './pages/AdminLessonTemplate';
import EditLesson from './pages/EditLesson';
import TestResults from "./pages/TestResults";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
            <Route path="/lessons" element={<ProtectedRoute><Lessons /></ProtectedRoute>} />
            <Route path="/lesson/:levelId/:lessonName" element={<LessonTemplate />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
            <Route path="/admin/add-lesson" element={<AddLesson />} />
            <Route path="/lesson-editor" element={<LessonEditor />} /> {/* Updated route */}
            <Route path="/user-details/:userId" element={<UserDetail />} />
            <Route path="/admin/lessons/:levelId/:lessonName" element={<AdminLessonTemplate />} />
            <Route path="/admin/edit-lesson/:lessonId" element={<EditLesson />} />
            <Route path="/test-results" element={<TestResults />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
