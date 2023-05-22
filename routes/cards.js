const router = require('express').Router();
const {
  celebrate,
  Joi,
} = require('celebrate');

const regexp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
const auth = require('../middlewares/auth');
const {
  getCard, cardDelete, createCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/cards', auth, getCard);
router.delete('/cards/:id', auth, celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24),
  }),
}), cardDelete);
router.post('/cards', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(regexp),
  }),
}), createCard);
router.put('/cards/:id/likes', auth, celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24),
  }),
}), likeCard);
router.delete('/cards/:id/likes', auth, celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24),
  }),
}), dislikeCard);

module.exports = router;
