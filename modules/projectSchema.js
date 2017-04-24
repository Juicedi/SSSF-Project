const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const projectSchema = new Schema({
  user: String,
  group: String,
  shared: Array,
  comments: Array,
  title: String,
  content: String,
});

module.exports = mongoose.model('Project', projectSchema);