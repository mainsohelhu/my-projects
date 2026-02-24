const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['recruiter', 'seeker'], default: 'seeker' } // Role decide karega kaun kya dekhega
});

module.exports = mongoose.model('User', UserSchema);