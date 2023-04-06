const Cards = require('../models/card');

const getCards = (req, res) => {
  Cards.find({})
  .populate('owner')
  .then((cards) => {
    res.status(200).send(cards);
  })
  .catch(() => {
    res.status(500).send({message: 'Sorry, something went wrong'});
  })
}

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Cards.findByIdAndDelete(cardId)
  .then((result) =>{
    res.status(200).res.send(result)
  })
  .catch(() => {
    res.status(404).send({message: 'Not found'})
  })
}

const newCard = (req, res) => {
  const { name, link } = req.body;
  Cards.create({ name, link, owner: req.user._id })
  .then((newCard) => {
    res.status(200).send(newCard);
  })
  .catch(() => {
    res.status(400).send({message: 'Incorrect data'})
  })
  }

const likeCard = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).then((result) =>{
    res.status(200).send(result)
  })
  .catch(() => {
    res.status(404).send({message: 'Not found'})
  })
}

const dislikeCard = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )  .then((result) =>{
    res.status(200).send(result)
  })
  .catch(() => {
    res.status(404).send({message: 'Not found'})
  })
}

module.exports = { getCards, deleteCard, newCard, likeCard, dislikeCard}