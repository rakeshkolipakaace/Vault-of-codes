import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material';
import { Search, Add } from '@mui/icons-material';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMethod, setFilterMethod] = useState('all');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (err) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterMethod === 'all' || 
                         project.preferredPaymentMethod === filterMethod;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'success';
      case 'in progress': return 'warning';
      case 'completed': return 'default';
      default: return 'default';
    }
  };

  const getPaymentMethodColor = (method) => {
    switch (method) {
      case 'skill': return 'primary';
      case 'money': return 'secondary';
      case 'both': return 'info';
      default: return 'default';
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Open Projects
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          component={Link}
          to="/projects/new"
        >
          Post Project
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
          }}
          sx={{ flexGrow: 1 }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Payment Method</InputLabel>
          <Select
            value={filterMethod}
            label="Payment Method"
            onChange={(e) => setFilterMethod(e.target.value)}
          >
            <MenuItem value="all">All Methods</MenuItem>
            <MenuItem value="skill">Skill Exchange</MenuItem>
            <MenuItem value="money">Money</MenuItem>
            <MenuItem value="both">Both</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {filteredProjects.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No projects found
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredProjects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {project.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {project.description?.substring(0, 100)}
                    {project.description?.length > 100 && '...'}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={project.status}
                      color={getStatusColor(project.status)}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={project.preferredPaymentMethod}
                      color={getPaymentMethodColor(project.preferredPaymentMethod)}
                      size="small"
                    />
                  </Box>

                  {project.skillsRequired && project.skillsRequired.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        Skills Required:
                      </Typography>
                      <Box sx={{ mt: 0.5 }}>
                        {project.skillsRequired.slice(0, 3).map((skill, index) => (
                          <Chip
                            key={index}
                            label={skill}
                            size="small"
                            variant="outlined"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                        {project.skillsRequired.length > 3 && (
                          <Chip
                            label={`+${project.skillsRequired.length - 3} more`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </Box>
                  )}

                  <Typography variant="caption" color="text.secondary">
                    Posted by: {project.client?.username}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    component={Link}
                    to={`/projects/${project._id}`}
                    fullWidth
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ProjectList; 