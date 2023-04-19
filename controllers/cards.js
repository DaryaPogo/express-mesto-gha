const Cards = require('../models/card');
const NotFoundError = require('../errors/notFound');
const BadRequestError = require('../errors/BadRequestError');
const DefaultError = require('../errors/DefaultError');

const SUCSESS = 200;

const getCards = (req, res) => {
  Cards.find({})
    .populate('owner')
    .then((cards) => {
      res.status(SUCSESS).send(cards);
    })
    .catch(() => {
      throw new DefaultError('Sorry, something went wrong');
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Cards.create({ name, link, owner: req.user._id })
    .then((newCard) => {
      res.status(SUCSESS).send(newCard);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('ss');
      } else {
        throw new DefaultError('Sorry, something went wrong');
      }
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  if (cardId === req.user._id) {
    Cards.findByIdAndDelete(cardId)
      .orFail(() => {
        throw new NotFoundError('Нет пользователя с таким id');
      })
      .then((result) => {
        res.status(SUCSESS).send(result);
      })
      .catch((err) => {
        if (err.name === 'CastError') {
          throw new BadRequestError('ss');
        } else {
          throw new DefaultError('Sorry, something went wrong');
        }
      });
  } else {
    throw new Error('Invalid Error');
  }
};

const likeCard = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Нет пользователя с таким id');
    })
    .then((result) => {
      res.status(SUCSESS).send(result);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('ss');
      } else {
        throw new DefaultError('Sorry, something went wrong');
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
      throw new NotFoundError('Нет пользователя с таким id');
    })
    .then((result) => {
      res.status(SUCSESS).send(result);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('ss');
      } else {
        throw new DefaultError('Sorry, something went wrong');
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
