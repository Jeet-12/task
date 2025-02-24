const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: String,
  content: String,
  category: {
    type: String,
    enum: ['Tech', 'Business', 'Sports'], // Define categories
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const News = mongoose.model('News', newsSchema);

module.exports = News;
