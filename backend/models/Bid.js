const mongoose = require('mongoose');

const BidSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  proposalText: String,
  barterOffer: [String], // skills offered in barter
  paymentOffer: Number,  // monetary offer (if any)
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Bid', BidSchema); 