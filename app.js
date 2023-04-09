const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const app = express();
const PORT = 3000;
const ERROR_USER = 404;

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '642be5fb3b6aa88f9319f190',
  };
  next();
});

app.use('/users', userRouter);
app.use('/cards', cardsRouter);

app.use('*', (req, res) => {
  res.status(ERROR_USER).send({ message: 'Not found' });
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
