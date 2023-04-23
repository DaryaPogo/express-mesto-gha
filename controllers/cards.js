const Cards = require('../models/card');
const NotFoundError = require('../errors/notFound');
const BadRequestError = require('../errors/BadRequestError');
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
        next(new BadRequestError('Incorrect data'));
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Cards.findById(cardId)
    .orFail(() => new NotFoundError('Нет карточки с таким id'))
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        Cards.findByIdAndDelete(cardId)
          .then(() => res.status(SUCSESS).send(card));
      } else {
        next(new ForbiddenError('Недостаточно прав'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Incorrect data'));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Нет карточки с таким id'));
      } else {
        res.status(SUCSESS).send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Incorrect data'));
      }
      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Нет карточки с таким id'));
      } else {
        res.status(SUCSESS).send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Incorrect data'));
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
