import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/api';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Chip,
  Grid,
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { Edit, Save, Cancel, Person } from '@mui/icons-material';

const Profile = () => {
  const { user, login } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    skills: [],
    barterSkills: []
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/auth/profile');
      setProfile(response.data);
      setFormData({
        username: response.data.username,
        email: response.data.email,
        skills: response.data.skills || [],
        barterSkills: response.data.barterSkills || []
      });
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSkillsChange = (field) => (event) => {
    const value = event.target.value;
    setFormData({
      ...formData,
      [field]: typeof value === 'string' ? value.split(',').map(s => s.trim()) : value,
    });
  };

  const handleSave = async () => {
    try {
      const response = await api.put('/auth/profile', formData);
      setProfile(response.data);
      login({
        ...user,
        username: response.data.username
      });
      setEditing(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData({
      username: profile.username,
      email: profile.email,
      skills: profile.skills || [],
      barterSkills: profile.barterSkills || []
    });
    setEditing(false);
    setError('');
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            <Person sx={{ mr: 2, verticalAlign: 'middle' }} />
            My Profile
          </Typography>
          {!editing && (
            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </Button>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={!editing}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!editing}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Role"
              value={user.role}
              disabled
              margin="normal"
              helperText="Role cannot be changed"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Skills (comma-separated)"
              name="skills"
              value={formData.skills.join(', ')}
              onChange={handleSkillsChange('skills')}
              disabled={!editing}
              margin="normal"
              multiline
              rows={3}
              helperText="Enter your professional skills"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Barter Skills (comma-separated)"
              name="barterSkills"
              value={formData.barterSkills.join(', ')}
              onChange={handleSkillsChange('barterSkills')}
              disabled={!editing}
              margin="normal"
              multiline
              rows={3}
              helperText="Skills you can offer in exchange"
            />
          </Grid>
        </Grid>

        {editing && (
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
            >
              Save Changes
            </Button>
            <Button
              variant="outlined"
              startIcon={<Cancel />}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </Box>
        )}

        <Divider sx={{ my: 4 }} />

        <Typography variant="h6" gutterBottom>
          Skills Preview
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              Professional Skills:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {formData.skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              Barter Skills:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {formData.barterSkills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  color="secondary"
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile; 