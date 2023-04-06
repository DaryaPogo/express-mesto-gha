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
    .catch(() => {
      res.status(ERROR_CODE).send({ message: 'Incorrect data' });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Cards.findByIdAndDelete(cardId)
    .orFail(() => {
      res.status(ERROR_USER).send({ message: 'Not found' });
    })
    .then((result) => {
      res.status(SUCSESS).send(result);
    })
    .catch(() => {
      res.status(ERROR_CODE).send({ message: 'Incorrect data' });
    });
};

const likeCard = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      res.status(ERROR_USER).send({ message: 'Not found' });
    })
    .then((result) => {
      res.status(SUCSESS).send(result);
    })
    .catch(() => {
      res.status(ERROR_CODE).send({ message: 'Incorrect data' });
    });
};

const dislikeCard = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      res.status(ERROR_USER).send({ message: 'Not found' });
    })
    .then((result) => {
      res.status(SUCSESS).send(result);
    })
    .catch(() => {
      res.status(ERROR_CODE).send({ message: 'Incorrect data' });
    });
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
};
