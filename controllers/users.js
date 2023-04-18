const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
// const crypto = require('crypto');

const ERROR_CODE = 400;
const ERROR_USER = 404;
const ERROR_DEFAULT = 500;
const SUCSESS = 200;

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(SUCSESS).send(users);
    })
    .catch(() => {
      res.status(ERROR_DEFAULT).send({ message: 'Sorry, something went wrong' });
    });
};

const findUser = (req, res) => {
  User.findById(req.user._id)
    .orFail(() => {
      res.status(ERROR_USER).send({ message: 'User is not found' });
    })
    .then((user) => {
      res.status(SUCSESS).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: err.message });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'Sorry, something went wrong' });
      }
    });
};

const createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name, about, avatar, email, password: hash,
    })
      .then((newUser) => {
        res.status(SUCSESS).send(newUser.toJSON());
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(ERROR_CODE).send({ message: err.message });
        } else {
          res.status(ERROR_DEFAULT).send({ message: 'Sorry, something went wrong' });
        }
      });
  });
};

const getInfo = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      res.status(SUCSESS).send(user);
    })
    .catch(() => {
      res.status(ERROR_DEFAULT).send({ message: 'Sorry, something went wrong' });
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      res.status(SUCSESS).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: err.message });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'Sorry, something went wrong' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => res.status(SUCSESS).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: err.message });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'Sorry, something went wrong' });
      }
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findOne({ email }).select('+password')
    .then(async (user) => {
      const matched = await bcrypt.compare(password, user.password);
      if (matched) {
        const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
        res.cookie('jwt', token, { httpOnly: true })
          .send(user.toJSON());
      } else {
        throw new Error('Invalid email');
      }
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

module.exports = {
  getUsers,
  findUser,
  getInfo,
  updateProfile,
  updateAvatar,
  login,
  createUser,
};
