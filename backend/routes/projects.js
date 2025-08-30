const express = require('express');
const Project = require('../models/Project');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

// Create Project
router.post('/', authenticate, async (req, res) => {
  try {
    const project = new Project({
      ...req.body,
      client: req.user._id
    });
    await project.save();
    res.status(201).json(project);
  } catch(err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all open projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({ status: 'open' }).populate('client', 'username');
    res.json(projects);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// Get project details
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('client', 'username email');
    if(!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// Update project status
router.patch('/:id/status', authenticate, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    
    if (project.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    project.status = req.body.status;
    await project.save();
    res.json(project);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's projects
router.get('/my-projects', authenticate, async (req, res) => {
  try {
    const projects = await Project.find({ client: req.user._id })
      .populate('client', 'username')
      .sort({ createdAt: -1 });
    
    res.json(projects);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete project
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    
    if (project.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    // Only allow deletion if project is open (no accepted bids)
    if (project.status !== 'open') {
      return res.status(400).json({ error: 'Cannot delete project with accepted bids' });
    }
    
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 