import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import GeometryTopicsList, { GEOM_TOPICS } from './components/TopicLists/GeometryTopicsList';
import Calculus from './components/Calculus';
import Algebra from './components/a-topics/FOILMethod';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/geometry" element={
              <ProtectedRoute>
                <GeometryTopicsList />
              </ProtectedRoute>
            } />
            {GEOM_TOPICS.map((topic) => (
              <Route key={topic.id} path={topic.path} element={
                <ProtectedRoute>
                  { < topic.component /> }
                </ProtectedRoute>
              } />
            ))}
            <Route path="/calculus" element={
              <ProtectedRoute>
                <Calculus />
              </ProtectedRoute>
            } />
            <Route path="/algebra" element={
              <ProtectedRoute>
                <Algebra />
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
