const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'worker'], required: true },
    qualification: { type: String }, // Optional: only for students
    jobTitle: { type: String }       // Optional: only for workers
});

module.exports = mongoose.model('User', UserSchema);