const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  preferredPaymentMethod: { type: String, enum: ['skill', 'money', 'both'], default: 'money' },
  skillsRequired: [String],
  status: { type: String, enum: ['open', 'in progress', 'completed'], default: 'open' },
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema); 