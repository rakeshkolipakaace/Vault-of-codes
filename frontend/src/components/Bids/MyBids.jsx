import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../Notifications/NotificationContext';
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
  Divider
} from '@mui/material';
import { CheckCircle, Cancel, Pending, Work, Refresh } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const MyBids = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyBids();
    
    // Refresh bids every 30 seconds to get real-time updates
    const interval = setInterval(fetchMyBids, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchMyBids = async () => {
    try {
      console.log('Fetching my bids...');
      const response = await api.get('/bids/my-bids');
      console.log('Bids response:', response.data);
      setBids(response.data);
    } catch (err) {
      console.error('Error fetching bids:', err);
      setError('Failed to load your bids');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle color="success" />;
      case 'rejected':
        return <Cancel color="error" />;
      case 'pending':
        return <Pending color="warning" />;
      default:
        return <Pending />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getProjectStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'success';
      case 'in progress':
        return 'warning';
      case 'completed':
        return 'default';
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
            My Bids
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track all your project bids and their current status
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchMyBids}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {bids.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Work sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No bids yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Start bidding on projects to see them here
            </Typography>
            <Button
              variant="contained"
              component={Link}
              to="/projects"
            >
              Browse Projects
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {bids.map((bid) => (
            <Grid item xs={12} key={bid._id}>
              <Card>
                <CardContent>
                                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                     <Box>
                       <Typography variant="h6" component="h2" gutterBottom>
                         {bid.project?.title}
                         {bid.status === 'accepted' && (
                           <Chip
                             label="ACCEPTED"
                             color="success"
                             size="small"
                             sx={{ ml: 1, fontWeight: 'bold' }}
                           />
                         )}
                       </Typography>
                       <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                         Client: {bid.project?.client?.username}
                       </Typography>
                     </Box>
                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                       {getStatusIcon(bid.status)}
                       <Chip
                         label={bid.status}
                         color={getStatusColor(bid.status)}
                         size="small"
                       />
                     </Box>
                   </Box>

                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={bid.project?.status}
                      color={getProjectStatusColor(bid.project?.status)}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={bid.project?.preferredPaymentMethod}
                      color="primary"
                      size="small"
                    />
                  </Box>

                  <Typography variant="body2" sx={{ mb: 2 }}>
                    <strong>Your Proposal:</strong> {bid.proposalText}
                  </Typography>

                  {bid.barterOffer && bid.barterOffer.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Skills Offered:</strong>
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {bid.barterOffer.map((skill, index) => (
                          <Chip
                            key={index}
                            label={skill}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {bid.paymentOffer && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      <strong>Payment Offer:</strong> ${bid.paymentOffer}
                    </Typography>
                  )}

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      Submitted: {new Date(bid.createdAt).toLocaleDateString()}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      component={Link}
                      to={`/projects/${bid.project?._id}`}
                    >
                      View Project
                    </Button>
                  </Box>

                  {bid.status === 'accepted' && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                      🎉 Congratulations! Your bid was accepted for "{bid.project?.title}". 
                      Contact {bid.project?.client?.username} to start working on the project.
                    </Alert>
                  )}

                  {bid.status === 'rejected' && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      Your bid was not selected for this project. Keep trying with other projects!
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

export default MyBids; 