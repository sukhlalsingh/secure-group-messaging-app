const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// SAFE: check if model already exists
const User = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = User;