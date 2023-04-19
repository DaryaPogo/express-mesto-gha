const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const InvalidError = require('../errors/InvalidError');
const NotFoundError = require('../errors/notFound');
const BadRequestError = require('../errors/BadRequestError');
const DefaultError = require('../errors/DefaultError');

const SUCSESS = 200;

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(SUCSESS).send(users);
    })
    .catch((err) => {
      throw new DefaultError('Sorry, something went wrong');
      next(err);
    });
};

const findUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('Нет пользователя с таким id');
    })
    .then((user) => {
      res.status(SUCSESS).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Incorrect data');
      } else {
        throw new DefaultError('Sorry, something went wrong');
      }
      next(err);
    });
};

const createUser = (req, res, next) => {
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
        if (err.code === 11000) {
          throw new BadRequestError('email занят');
        }
        if (err.name === 'ValidationError') {
          throw new BadRequestError('Incorrect data');
        } else {
          throw new DefaultError('Sorry, something went wrong');
        }
        next(err);
      })
      .catch(next);
  });
};

const getInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.status(SUCSESS).send(user);
    })
    .catch((err) => {
      throw new DefaultError('Sorry, something went wrong');
      next(err);
    });
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      res.status(SUCSESS).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Incorrect data');
      } else {
        throw new DefaultError('Sorry, something went wrong');
      }
      next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => res.status(SUCSESS).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Incorrect data');
      } else {
        throw new DefaultError('Sorry, something went wrong');
      }
      next(err);
    });
};

const login = (req, res, next) => {
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
      throw new InvalidError('Invalid token');
      next(err);
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
