// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Pages
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Assignments from './pages/Assignments';
import Announcements from './pages/Announcements';
import StudentGrades from './pages/StudentGrades';
import ViewSubmissions from './pages/ViewSubmissions';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const TeacherRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'Teacher') return <Navigate to="/dashboard" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <PrivateRoute><Dashboard /></PrivateRoute>
          } />
          <Route path="/courses" element={
            <PrivateRoute><Courses /></PrivateRoute>
          } />
          <Route path="/assignments" element={
            <PrivateRoute><Assignments /></PrivateRoute>
          } />
          <Route path="/announcements" element={
            <PrivateRoute><Announcements /></PrivateRoute>
          } />
          <Route path="/grades" element={
            <PrivateRoute><StudentGrades /></PrivateRoute>
          } />
          <Route path="/submissions/:assignmentId" element={
            <TeacherRoute><ViewSubmissions /></TeacherRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;