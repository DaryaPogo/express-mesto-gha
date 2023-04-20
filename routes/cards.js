const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');
const mongoose = require('mongoose');

const BadRequestError = require('../errors/BadRequestError');

const {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': 'Length must be greate than 2',
        'string.max': 'Length must be less than 30',
        'any.required': 'Field is required',
      }),
    link: Joi.string().required().messages({
      'any.required': 'Field is required',
    }),
  }),
}), createCard);

router.delete(
  '/:cardId',
  celebrate({
    [Segments.BODY]: {
      id: Joi.custom((valid) => {
        if (!mongoose.isValidObjectId(valid)) {
          throw new BadRequestError('Invalid Error');
        }
      }),
    },
  }),
  deleteCard,
);

router.put(
  '/:cardId/likes',
  celebrate({
    [Segments.BODY]: {
      id: Joi.custom((valid) => {
        if (!mongoose.isValidObjectId(valid)) {
          throw new BadRequestError('Invalid Error');
        }
      }),
    },
  }),
  likeCard,
);

router.delete(
  '/:cardId/likes',
  celebrate({
    [Segments.BODY]: {
      id: Joi.custom((valid) => {
        if (!mongoose.isValidObjectId(valid)) {
          throw new BadRequestError('Invalid Error');
        }
      }),
    },
  }),
  dislikeCard,
);

module.exports = router;
