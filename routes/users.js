const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');
const mongoose = require('mongoose');

const BadRequestError = require('../errors/BadRequestError');

const {
  getUsers,
  findUser,
  getInfo,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get(
  '/:userId',
  celebrate({
    [Segments.BODY]: {
      id: Joi.custom((valid) => {
        if (!mongoose.isValidObjectId(valid)) {
          throw new BadRequestError('Invalid Error');
        }
      }),
    },
  }),
  findUser,
);
router.get('/me', getInfo);

router.patch('/me', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      'string.min': 'Length must be greate than 2',
      'string.max': 'Length must be less than 30',
      'any.required': 'Field is required',
    }),
    about: Joi.string().min(2).max(30).messages({
      'string.min': 'Length must be greate than 2',
      'string.max': 'Length must be less than 30',
      'any.required': 'Field is required',
    }),
  }).unknown(true),
}), updateProfile);

router.patch('/me/avatar', celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().regex(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?$/),
  }).unknown(true),
}), updateAvatar);

module.exports = router;
