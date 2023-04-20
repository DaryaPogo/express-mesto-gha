const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'required field'],
    minlength: [2, 'Length must be greate than 2'],
    maxlength: [30, 'Length must be less than 30'],
  },
  link: {
    type: String,
    required: [true, 'required field'],
    validate: {
      validator: (value) => validator.isURL(value),
      message: 'Must be a Valid URL',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
