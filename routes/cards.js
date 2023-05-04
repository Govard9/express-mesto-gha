const router = require('express').Router();

const {
  getCard, cardDelete, createCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCard);
router.delete('/cards/:id', cardDelete);
router.post('/cards', createCard);
router.put('/cards/:id/likes', likeCard);
router.delete('/cards/:id/likes', dislikeCard);

module.exports = router;
