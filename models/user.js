const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'required field'],
    minlength: [2, 'Length must be greate 2'],
    maxlength: [30, 'Length must be less than 30'],
  },
  about: {
    type: String,
    required: [true, 'required field'],
    minlength: [2, 'Length must be greate 2'],
    maxlength: [30, 'Length must be less than 30'],
  },
  avatar: {
    type: String,
    required: [true, 'required field'],
  },
});

module.exports = mongoose.model('user', userSchema);
