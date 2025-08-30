import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './components/Notifications/NotificationContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  CssBaseline
} from '@mui/material';
import { Work, ExitToApp, PersonAdd, Login as LoginIcon, Home } from '@mui/icons-material';

// Import components
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Profile from './components/Profile/Profile';
import ProjectList from './components/Projects/ProjectList';
import ProjectDetail from './components/Projects/ProjectDetail';
import PostProject from './components/Projects/PostProject';
import MyProjects from './components/Projects/MyProjects';
import MyBids from './components/Bids/MyBids';
import BidTest from './components/Debug/BidTest';

const Navigation = () => {
  const { user, logout } = useAuth();

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar>
          <Work sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Barter Marketplace
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {user ? (
              <>
                <Button color="inherit" component={Link} to="/">
                  <Home sx={{ mr: 1 }} />
                  Home
                </Button>
                <Button color="inherit" component={Link} to="/projects">
                  Projects
                </Button>
                {user.role === 'client' ? (
                  <>
                    <Button color="inherit" component={Link} to="/projects/new">
                      Post Project
                    </Button>
                    <Button color="inherit" component={Link} to="/my-projects">
                      My Projects
                    </Button>
                  </>
                ) : (
                  <Button color="inherit" component={Link} to="/my-bids">
                    My Bids
                  </Button>
                )}
                <Button color="inherit" component={Link} to="/profile">
                  Profile
                </Button>
                <Button color="inherit" component={Link} to="/debug">
                  Debug
                </Button>
                <Button
                  color="inherit"
                  startIcon={<ExitToApp />}
                  onClick={logout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  startIcon={<LoginIcon />}
                  component={Link}
                  to="/login"
                >
                  Login
                </Button>
                <Button
                  color="inherit"
                  startIcon={<PersonAdd />}
                  component={Link}
                  to="/register"
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      <Route path="/projects" element={<ProjectList />} />
      <Route path="/projects/:id" element={<ProjectDetail />} />
      <Route 
        path="/projects/new" 
        element={
          <ProtectedRoute>
            <PostProject />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/my-projects" 
        element={
          <ProtectedRoute>
            <MyProjects />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/my-bids" 
        element={
          <ProtectedRoute>
            <MyBids />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/debug" 
        element={
          <ProtectedRoute>
            <BidTest />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <CssBaseline />
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navigation />
          <Box component="main" sx={{ flexGrow: 1 }}>
            <AppRoutes />
          </Box>
        </Box>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App; 