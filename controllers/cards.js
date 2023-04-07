const Cards = require('../models/card');

const ERROR_CODE = 400;
const ERROR_USER = 404;
const ERROR_DEFAULT = 500;
const SUCSESS = 200;

const getCards = (req, res) => {
  Cards.find({})
    .populate('owner')
    .then((cards) => {
      res.status(SUCSESS).send(cards);
    })
    .catch(() => {
      res.status(ERROR_DEFAULT).send({ message: 'Sorry, something went wrong' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Cards.create({ name, link, owner: req.user._id })
    .then((newCard) => {
      res.status(SUCSESS).send(newCard);
    })
    .catch((err) => {
      res.status(ERROR_CODE).send({ message: err.message });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Cards.findByIdAndDelete(cardId)
    .orFail(() => {
      res.status(ERROR_USER).send({ message: 'User is not found' });
    })
    .then((result) => {
      res.status(SUCSESS).send(result);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: err.message });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'Sorry, something went wrong' });
      }
    });
};

const likeCard = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      res.status(ERROR_USER).send({ message: 'User is not found'});
    })
    .then((result) => {
      res.status(SUCSESS).send(result);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: err.message });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'Sorry, something went wrong' });
      }
    });
};

const dislikeCard = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      res.status(ERROR_USER).send({ message: 'User is not found' });
    })
    .then((result) => {
      res.status(SUCSESS).send(result);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: err.message });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'Sorry, something went wrong' });
      }
    });
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
};
