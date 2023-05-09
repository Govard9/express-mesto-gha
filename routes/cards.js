const router = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getCard, cardDelete, createCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/cards', auth, getCard);
router.delete('/cards/:id', auth, cardDelete);
router.post('/cards', auth, createCard);
router.put('/cards/:id/likes', auth, likeCard);
router.delete('/cards/:id/likes', auth, dislikeCard);

module.exports = router;
