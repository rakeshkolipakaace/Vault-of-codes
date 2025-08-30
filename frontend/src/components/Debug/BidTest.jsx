import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/api';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Alert
} from '@mui/material';

const BidTest = () => {
  const { user } = useAuth();
  const [myBids, setMyBids] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMyBids = async () => {
    try {
      setLoading(true);
      const response = await api.get('/bids/my-bids');
      console.log('My Bids:', response.data);
      setMyBids(response.data);
    } catch (err) {
      console.error('Error fetching bids:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      console.log('Projects:', response.data);
      setProjects(response.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyBids();
      fetchProjects();
    }
  }, [user]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Debug: Bid Status Test
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Current User: {user?.username} ({user?.role})
        </Typography>
        <Button onClick={fetchMyBids} disabled={loading}>
          Refresh My Bids
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          My Bids ({myBids.length})
        </Typography>
        <List>
          {myBids.map((bid) => (
            <ListItem key={bid._id} divider>
              <ListItemText
                primary={`${bid.project?.title} - Status: ${bid.status}`}
                secondary={`Project Status: ${bid.project?.status} | Client: ${bid.project?.client?.username}`}
              />
            </ListItem>
          ))}
        </List>
        {myBids.length === 0 && (
          <Alert severity="info">No bids found</Alert>
        )}
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Available Projects ({projects.length})
        </Typography>
        <List>
          {projects.map((project) => (
            <ListItem key={project._id} divider>
              <ListItemText
                primary={project.title}
                secondary={`Status: ${project.status} | Client: ${project.client?.username}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default BidTest; 