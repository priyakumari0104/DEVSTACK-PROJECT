const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  title: String,
  link: String,
  category: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Resource', ResourceSchema);