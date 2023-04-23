const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');

const {
  getUsers,
  findUser,
  getInfo,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getInfo);

router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().hex().length(24),
    }),
  }),
  findUser,
);

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
  }),
}), updateProfile);

router.patch('/me/avatar', celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().regex(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?$/),
  }),
}), updateAvatar);

module.exports = router;
