const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category:   { type: String, required: true },
  amount:     { type: Number, required: true, min: 0 },
  period:     { type: String, default: 'monthly' }
}, { timestamps: true });

module.exports = mongoose.model('Budget', budgetSchema);
