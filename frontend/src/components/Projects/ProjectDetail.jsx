import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../Notifications/NotificationContext';
import api from '../../api/api';
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { ArrowBack, Send, Delete } from '@mui/icons-material';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [project, setProject] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bidDialogOpen, setBidDialogOpen] = useState(false);
  const [bidForm, setBidForm] = useState({
    proposalText: '',
    barterOffer: '',
    paymentOffer: ''
  });

  useEffect(() => {
    fetchProject();
    if (user) {
      fetchBids();
    }
  }, [id, user]);

  const fetchProject = async () => {
    try {
      const response = await api.get(`/projects/${id}`);
      setProject(response.data);
    } catch (err) {
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const fetchBids = async () => {
    try {
      const response = await api.get(`/bids/project/${id}`);
      setBids(response.data);
    } catch (err) {
      console.error('Failed to load bids:', err);
    }
  };

  const handleBidSubmit = async () => {
    try {
      const bidData = {
        project: id,
        proposalText: bidForm.proposalText,
        barterOffer: bidForm.barterOffer.split(',').map(s => s.trim()).filter(s => s),
        paymentOffer: bidForm.paymentOffer ? parseFloat(bidForm.paymentOffer) : null
      };

      await api.post('/bids', bidData);
      setBidDialogOpen(false);
      setBidForm({ proposalText: '', barterOffer: '', paymentOffer: '' });
      fetchBids();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit bid');
    }
  };

  const handleBidAction = async (bidId, action) => {
    try {
      await api.patch(`/bids/${bidId}/status`, { status: action });
      fetchBids();
      fetchProject();
      
      if (action === 'accepted') {
        addNotification(`Bid accepted! Project "${project.title}" is now in progress.`, 'success');
      } else if (action === 'rejected') {
        addNotification('Bid rejected.', 'info');
      }
    } catch (err) {
      setError('Failed to update bid status');
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await api.delete(`/projects/${id}`);
        addNotification('Project deleted successfully!', 'success');
        navigate('/projects');
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete project');
      }
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!project) {
    return (
      <Container>
        <Alert severity="error">Project not found</Alert>
      </Container>
    );
  }

  const isOwner = user && project.client?._id === user.id;
  const canBid = user && user.role === 'freelancer' && !isOwner && project.status === 'open';

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/projects')}
        sx={{ mb: 3 }}
      >
        Back to Projects
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="h4" component="h1">
                {project.title}
              </Typography>
              <Box>
                <Chip
                  label={project.status}
                  color={project.status === 'open' ? 'success' : 'warning'}
                  sx={{ mr: 1 }}
                />
                <Chip
                  label={project.preferredPaymentMethod}
                  color="primary"
                />
              </Box>
            </Box>

            <Typography variant="body1" sx={{ mb: 3 }}>
              {project.description}
            </Typography>

            {project.skillsRequired && project.skillsRequired.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Skills Required:
                </Typography>
                <Box>
                  {project.skillsRequired.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      variant="outlined"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Posted by: {project.client?.username}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {canBid && (
                  <Button
                    variant="contained"
                    startIcon={<Send />}
                    onClick={() => setBidDialogOpen(true)}
                  >
                    Submit Bid
                  </Button>
                )}
                {isOwner && project.status === 'open' && (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    onClick={handleDeleteProject}
                  >
                    Delete Project
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          {isOwner && bids.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Bids ({bids.length})
                </Typography>
                <List>
                  {bids.map((bid) => (
                    <React.Fragment key={bid._id}>
                      <ListItem>
                        <ListItemText
                          primary={bid.freelancer?.username}
                          secondary={
                            <Box>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                {bid.proposalText}
                              </Typography>
                              {bid.barterOffer && bid.barterOffer.length > 0 && (
                                <Box sx={{ mb: 1 }}>
                                  <Typography variant="caption" color="text.secondary">
                                    Barter Offer:
                                  </Typography>
                                  <Box>
                                    {bid.barterOffer.map((skill, index) => (
                                      <Chip
                                        key={index}
                                        label={skill}
                                        size="small"
                                        sx={{ mr: 0.5, mb: 0.5 }}
                                      />
                                    ))}
                                  </Box>
                                </Box>
                              )}
                              {bid.paymentOffer && (
                                <Typography variant="caption" color="text.secondary">
                                  Payment Offer: ${bid.paymentOffer}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                      {bid.status === 'pending' && (
                        <Box sx={{ px: 2, pb: 1 }}>
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            sx={{ mr: 1 }}
                            onClick={() => handleBidAction(bid._id, 'accepted')}
                          >
                            Accept
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => handleBidAction(bid._id, 'rejected')}
                          >
                            Reject
                          </Button>
                        </Box>
                      )}
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Bid Dialog */}
      <Dialog open={bidDialogOpen} onClose={() => setBidDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Submit Your Bid</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Proposal"
            value={bidForm.proposalText}
            onChange={(e) => setBidForm({ ...bidForm, proposalText: e.target.value })}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="Barter Skills (comma-separated)"
            value={bidForm.barterOffer}
            onChange={(e) => setBidForm({ ...bidForm, barterOffer: e.target.value })}
            sx={{ mb: 2 }}
            helperText="Enter skills you can offer in exchange"
          />
          <TextField
            fullWidth
            label="Payment Offer ($)"
            type="number"
            value={bidForm.paymentOffer}
            onChange={(e) => setBidForm({ ...bidForm, paymentOffer: e.target.value })}
            helperText="Leave empty if only offering skills"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBidDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleBidSubmit} variant="contained">
            Submit Bid
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProjectDetail; 