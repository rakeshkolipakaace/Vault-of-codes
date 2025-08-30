const express = require('express');
const Bid = require('../models/Bid');
const Project = require('../models/Project');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

// Submit a bid
router.post('/', authenticate, async (req, res) => {
  try {
    const project = await Project.findById(req.body.project);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    if (project.client.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: 'Cannot bid on your own project' });
    }
    
    const existingBid = await Bid.findOne({
      project: req.body.project,
      freelancer: req.user._id
    });
    
    if (existingBid) {
      return res.status(400).json({ error: 'You have already bid on this project' });
    }
    
    const bid = new Bid({
      ...req.body,
      freelancer: req.user._id
    });
    
    await bid.save();
    res.status(201).json(bid);
  } catch(err) {
    res.status(400).json({ error: err.message });
  }
});

// Get bids for a project
router.get('/project/:projectId', authenticate, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Only project owner can see bids
    if (project.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    const bids = await Bid.find({ project: req.params.projectId })
      .populate('freelancer', 'username email skills barterSkills');
    
    res.json(bids);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's bids
router.get('/my-bids', authenticate, async (req, res) => {
  try {
    const bids = await Bid.find({ freelancer: req.user._id })
      .populate({
        path: 'project',
        select: 'title description status preferredPaymentMethod',
        populate: {
          path: 'client',
          select: 'username'
        }
      });
    
    res.json(bids);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// Accept/Reject a bid
router.patch('/:id/status', authenticate, async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id)
      .populate('project')
      .populate('freelancer', 'username email');
    
    if (!bid) {
      return res.status(404).json({ error: 'Bid not found' });
    }
    
    if (bid.project.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    bid.status = req.body.status;
    await bid.save();
    
    // If bid is accepted, update project status and reject other bids
    if (req.body.status === 'accepted') {
      await Project.findByIdAndUpdate(bid.project._id, { status: 'in progress' });
      
      // Reject all other bids for this project
      await Bid.updateMany(
        { 
          project: bid.project._id, 
          _id: { $ne: bid._id },
          status: 'pending'
        },
        { status: 'rejected' }
      );
    }
    
    // Return the updated bid with populated data
    const updatedBid = await Bid.findById(bid._id)
      .populate('project')
      .populate('freelancer', 'username email');
    
    res.json(updatedBid);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 