const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  score: { type: Number, default: 0 },
  votes: { type: Map, of: Number, default: {} }, // Stores voterId -> score
});

participantSchema.methods.updateScore = function (voterId, score) {
  this.votes.set(voterId, score);
  this.score = Array.from(this.votes.values()).reduce((a, b) => a + b, 0);
  return this.save();
};

const Participant = mongoose.model('Participant', participantSchema);

module.exports = Participant;
