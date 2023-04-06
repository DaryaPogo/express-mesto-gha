const router = require('express').Router();
const { getCard, deleteCard, newCard, likeCard, dislikeCard} = require('../controllers/cards');

router.get('/', getCard);

router.post('/', newCard);

router.delete('/:cardId', deleteCard);

router.put('/:cardId/likes', likeCard);

router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
