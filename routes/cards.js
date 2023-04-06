const router = require('express').Router();
const Cards = require('../models/card');

router.get('/', (req, res) => {
  Cards.find({})
  .populate('owner')
  .then((cards) => {
    res.status(200).send(cards);
  })
  .catch(() => {
    res.status(500).send({message: 'Sorry, something went wrong'});
  })
});

router.post('/', (req, res) => {
  const { name, link } = req.body;
  Cards.create({ name, link, owner: req.user._id })
  .then((newCard) => {
    res.status(200).res.send(newCard);
  })
  .catch(() => {
    res.status(400).send({message: 'Incorrect data'})
  })
  });

router.delete('/:cardId', (req, res) => {
  const { cardId } = req.params;
  Cards.findByIdAndDelete(cardId)
  .orFail(() => {
    res.status(404).send({message: 'Not found'})
  })
  .then((result) =>{
    res.status(200).res.send(result)
  })
});

module.exports = router;
