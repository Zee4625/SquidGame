
const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rating: { type: Number, default: 0 },
  status: { type: String, enum: ['Alive', 'Eliminated'], default: 'Alive' }
});

module.exports = mongoose.model('Player', playerSchema);
