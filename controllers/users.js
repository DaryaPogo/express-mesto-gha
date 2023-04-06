const User = require('../models/user');

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
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      res.status(ERROR_USER).send({ message: 'Not found' });
    })
    .then((user) => {
      res.status(SUCSESS).send(user);
    })
    .catch(() => {
      res.status(ERROR_CODE).send({ message: 'Incorrect data' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((newUser) => {
      res.status(SUCSESS).send(newUser);
    })
    .catch(() => {
      res.status(ERROR_CODE).send({ message: 'Incorrect data' });
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      res.status(SUCSESS).send(user);
    })
    .catch(() => res.status(ERROR_CODE).send({ message: 'Incorrect data' }));
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => res.status(200).send(user))
    .catch(() => res.status(ERROR_CODE).send({ message: 'Incorrect data' }));
};

module.exports = {
  getUsers,
  findUser,
  createUser,
  updateProfile,
  updateAvatar,
};
