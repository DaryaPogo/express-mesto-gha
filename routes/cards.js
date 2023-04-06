const router = require('express').Router();
const { getCards, deleteCard, newCard, likeCard, dislikeCard} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', newCard);

router.delete('/:cardId', deleteCard);

router.put('/:cardId/likes', likeCard);

router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
