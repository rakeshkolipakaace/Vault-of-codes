import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/api';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Button,
  Grid,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { Add, Work, CheckCircle, Pending, Cancel } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const MyProjects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyProjects();
  }, []);

  const fetchMyProjects = async () => {
    try {
      const response = await api.get('/projects/my-projects');
      setProjects(response.data);
    } catch (err) {
      setError('Failed to load your projects');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <Pending color="warning" />;
      case 'in progress':
        return <CheckCircle color="success" />;
      case 'completed':
        return <CheckCircle color="default" />;
      default:
        return <Pending />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'warning';
      case 'in progress':
        return 'success';
      case 'completed':
        return 'default';
      default:
        return 'default';
    }
  };

  const getPaymentMethodColor = (method) => {
    switch (method) {
      case 'skill':
        return 'primary';
      case 'money':
        return 'secondary';
      case 'both':
        return 'info';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            My Projects
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage all your posted projects
          </Typography>
        </Box>
        <Button
          variant="contained"
          component={Link}
          to="/projects/new"
          startIcon={<Add />}
        >
          Post New Project
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {projects.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Work sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No projects yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Start posting projects to see them here
            </Typography>
            <Button
              variant="contained"
              component={Link}
              to="/projects/new"
            >
              Post Your First Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid item xs={12} key={project._id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" component="h2" gutterBottom>
                        {project.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Posted: {new Date(project.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getStatusIcon(project.status)}
                      <Chip
                        label={project.status}
                        color={getStatusColor(project.status)}
                        size="small"
                      />
                    </Box>
                  </Box>

                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {project.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={project.preferredPaymentMethod}
                      color={getPaymentMethodColor(project.preferredPaymentMethod)}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    {project.skillsRequired && project.skillsRequired.length > 0 && (
                      <Typography variant="caption" color="text.secondary">
                        Skills: {project.skillsRequired.join(', ')}
                      </Typography>
                    )}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {project.bids?.length || 0} bids received
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        component={Link}
                        to={`/projects/${project._id}`}
                      >
                        View Details
                      </Button>
                      {project.status === 'open' && (
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          component={Link}
                          to={`/projects/${project._id}`}
                        >
                          Delete
                        </Button>
                      )}
                    </Box>
                  </Box>

                  {project.status === 'in progress' && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                      🚀 Project is in progress! Work with your selected freelancer.
                    </Alert>
                  )}

                  {project.status === 'completed' && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      ✅ Project completed! Don't forget to exchange skills or payment.
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MyProjects; 