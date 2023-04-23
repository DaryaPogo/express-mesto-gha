const Cards = require('../models/card');
const NotFoundError = require('../errors/notFound');
const BadRequestError = require('../errors/BadRequestError');
const DefaultError = require('../errors/DefaultError');
const ForbiddenError = require('../errors/ForbiddenError');

const SUCSESS = 200;

const getCards = (req, res, next) => {
  Cards.find({})
    .populate('owner')
    .then((cards) => {
      res.status(SUCSESS).send(cards);
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Cards.create({ name, link, owner: req.user })
    .then((newCard) => {
      res.status(SUCSESS).send(newCard);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Incorrect data');
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  if (cardId === req.user) {
    Cards.findByIdAndDelete(cardId)
      .orFail(() => {
        throw new ForbiddenError('Недостаточно прав');
      })
      .then((result) => {
        res.status(SUCSESS).send(result);
      })
      .catch((err) => {
        if (err.name === 'CastError') {
          throw new BadRequestError('Incorrect data');
        } else {
          throw new DefaultError('Sorry, something went wrong');
        }
      });
  } else {
    throw new DefaultError('Invalid Error');
  }
};

const likeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user } },
    { new: true },
  )
    .then((result) => {
      if (!result) {
        throw new NotFoundError('Нет карточки с таким id');
      }
      res.status(SUCSESS).send(result);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Incorrect data');
      }
      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user } },
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
        throw new BadRequestError('Incorrect data');
      }
      next(err);
    });
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
};
