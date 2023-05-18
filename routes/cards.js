const router = require('express').Router();
const {
  celebrate,
  Joi,
} = require('celebrate');

const regexp = /(https?:\/\/)(w{3}\.)?\w+[-.~:/?#[\]@!$&'()*+,;=]*#?/;
const auth = require('../middlewares/auth');
const {
  getCard, cardDelete, createCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/cards', auth, getCard);
router.delete('/cards/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24),
  }),
}), auth, cardDelete);
router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(regexp),
  }),
}), auth, createCard);
router.put('/cards/:id/likes', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24),
  }),
}), auth, likeCard);
router.delete('/cards/:id/likes', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24),
  }),
}), auth, dislikeCard);

module.exports = router;
