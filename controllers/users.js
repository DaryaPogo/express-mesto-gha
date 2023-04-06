const User = require('../models/user')

const getUsers = (req, res) => {
  User.find({}).then((users) => {
    res.status(200).send(users);
  })
  .catch(() => {
    res.status(500).send({message: 'Sorry, something went wrong'})
  })
}

const findUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
  .orFail(
    () => res.status(404).send({message: 'Not found'})
  )
  .then((user) => {
    res.status(200).send(user);
  })
  .catch(() => {
    res.status(404).send({message: 'Not found'})
  })
}

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar }).then((newUser) => {
    res.status(200).send(newUser);
  })
  .catch(() => {
    res.status(400).send({message: 'Incorrect data'})
  })
}

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, {$set: {name, about}}, { new: true })
  .then((user) =>  res.status(200).send(user))
  .catch(() => res.status(400).send({message: 'Incorrect data'}))
}

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, {avatar}, { new: true })
  .then((user) => res.status(200).send(user))
  .catch(() => res.status(400).send({message: 'Incorrect data'}))
}

module.exports = { getUsers, findUser, createUser, updateProfile, updateAvatar }