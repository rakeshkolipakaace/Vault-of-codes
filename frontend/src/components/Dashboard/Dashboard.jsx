import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Chip
} from '@mui/material';
import { Work, Person, Add, Search } from '@mui/icons-material';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to Barter Marketplace
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
            Exchange skills, build projects, and grow together
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 6 }}>
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/register"
              startIcon={<Person />}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/login"
            >
              Sign In
            </Button>
          </Box>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Work sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Find Projects
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Browse through hundreds of projects and find the perfect match for your skills
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Add sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Post Projects
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Share your project requirements and get bids from skilled freelancers
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Search sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Exchange Skills
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Trade your expertise for other skills or get paid for your work
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome back, {user.username}! 👋
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Ready to {user.role === 'client' ? 'post a project' : 'find work'}?
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {user.role === 'client' ? (
                <>
                  <Button
                    variant="contained"
                    component={Link}
                    to="/projects/new"
                    startIcon={<Add />}
                    size="large"
                  >
                    Post New Project
                  </Button>
                  <Button
                    variant="outlined"
                    component={Link}
                    to="/my-projects"
                    startIcon={<Work />}
                    size="large"
                  >
                    My Projects
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="contained"
                    component={Link}
                    to="/projects"
                    startIcon={<Search />}
                    size="large"
                  >
                    Browse Projects
                  </Button>
                  <Button
                    variant="outlined"
                    component={Link}
                    to="/my-bids"
                    startIcon={<Work />}
                    size="large"
                  >
                    My Bids
                  </Button>
                </>
              )}
              <Button
                variant="outlined"
                component={Link}
                to="/profile"
                startIcon={<Person />}
                size="large"
              >
                View Profile
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Your Account
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body1">
                <strong>Role:</strong> 
                <Chip 
                  label={user.role} 
                  color={user.role === 'client' ? 'primary' : 'secondary'}
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Typography>
              <Typography variant="body1">
                <strong>Username:</strong> {user.username}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 