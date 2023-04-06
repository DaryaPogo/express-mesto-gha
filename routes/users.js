const router = require('express').Router();
const User = require('../models/user');

router.get('/', (req, res) => {
  User.find({}).then((users) => {
    res.status(200).send(users);
  })
  .catch(() => {
    res.status(500).send({message: 'Sorry, something went wrong'})
  })
});

router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  User.findById(userId).then((user) => {
    res.status(200).send(user);
  })
  .catch(() => {
    res.status(404).send({message: 'Not found'})
  })
});

router.post('/', (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar }).then((newUser) => {
    res.status(200).send(newUser);
  })
  .catch(() => {
    res.status(400).send({message: 'Incorrect data'})
  })
});

router.patch('/me', (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, {name, about}, { new: true })
  .then((user) => res.status(200).send(user))
  .catch(() => res.status(400).send({message: 'Incorrect data'}))
})

router.patch('/me/avatar', (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, {avatar}, { new: true })
  .then((user) => res.status(200).send(user))
  .catch(() => res.status(400).send({message: 'Incorrect data'}))
})

module.exports = router;
