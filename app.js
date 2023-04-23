const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookiesParser = require('cookie-parser');
const { errors } = require('celebrate');
const { celebrate, Joi, Segments } = require('celebrate');

const { autotorization } = require('./middlewares/auth');
const userRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const NotFoundError = require('./errors/notFound');
const {
  login,
  createUser,
} = require('./controllers/users');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cookiesParser());

app.post('/signin', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email().messages({
      'any.required': 'Field is required',
    }),
    password: Joi.string().required().messages({
      'any.required': 'Field is required',
    }),
  }),
}), login);

app.post('/signup', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email().messages({
      'any.required': 'Field is required',
    }),
    password: Joi.string().required().messages({
      'any.required': 'Field is required',
    }),
    name: Joi.string().min(2).max(30).messages({
      'string.min': 'Length must be greate than 2',
      'string.max': 'Length must be less than 30',
    }),
    about: Joi.string().min(2).max(30).messages({
      'string.min': 'Length must be greate than 2',
      'string.max': 'Length must be less than 30',
    }),
    avatar: Joi.string().regex(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?$/),
  }),
}), createUser);

app.use(autotorization);
app.use('/users', userRouter);
app.use('/cards', cardsRouter);

app.use('*', (req, res, next) => {
  next(new NotFoundError('Page not found'));
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log('Connected');
  })
  .catch((err) => {
    console.log(`error ${err}`);
  });

app.listen(PORT, () => {
  console.log(`Listen on ${PORT}`);
});
