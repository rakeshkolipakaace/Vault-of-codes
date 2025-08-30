import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput
} from '@mui/material';
import { Add, ArrowBack } from '@mui/icons-material';

const PostProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    preferredPaymentMethod: 'money',
    skillsRequired: []
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSkillsChange = (event) => {
    const value = event.target.value;
    setFormData({
      ...formData,
      skillsRequired: typeof value === 'string' ? value.split(',') : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const projectData = {
        ...formData,
        skillsRequired: formData.skillsRequired.map(skill => skill.trim()).filter(skill => skill)
      };

      await api.post('/projects', projectData);
      navigate('/projects');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 4,
          marginBottom: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, width: '100%' }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/projects')}
              sx={{ mr: 2 }}
            >
              Back
            </Button>
            <Typography component="h1" variant="h4">
              Post New Project
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="title"
              label="Project Title"
              name="title"
              autoFocus
              value={formData.title}
              onChange={handleChange}
              disabled={loading}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="description"
              label="Project Description"
              id="description"
              multiline
              rows={6}
              value={formData.description}
              onChange={handleChange}
              disabled={loading}
              helperText="Describe your project requirements in detail"
            />

            <FormControl fullWidth margin="normal">
              <InputLabel id="payment-method-label">Preferred Payment Method</InputLabel>
              <Select
                labelId="payment-method-label"
                id="preferredPaymentMethod"
                name="preferredPaymentMethod"
                value={formData.preferredPaymentMethod}
                label="Preferred Payment Method"
                onChange={handleChange}
                disabled={loading}
              >
                <MenuItem value="money">Money Only</MenuItem>
                <MenuItem value="skill">Skill Exchange Only</MenuItem>
                <MenuItem value="both">Both Money and Skills</MenuItem>
              </Select>
            </FormControl>

            <TextField
              margin="normal"
              fullWidth
              name="skillsRequired"
              label="Required Skills (comma-separated)"
              id="skillsRequired"
              value={formData.skillsRequired.join(', ')}
              onChange={handleSkillsChange}
              disabled={loading}
              helperText="Enter the skills required for this project, separated by commas"
            />

            {formData.skillsRequired.length > 0 && (
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Skills Preview:
                </Typography>
                <Box>
                  {formData.skillsRequired.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill.trim()}
                      variant="outlined"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <Add />}
              sx={{ mt: 3, mb: 2, height: 48 }}
              disabled={loading}
            >
              {loading ? 'Creating Project...' : 'Post Project'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default PostProject; 