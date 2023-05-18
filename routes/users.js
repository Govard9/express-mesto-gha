const router = require('express')
  .Router();
const {
  celebrate,
  Joi,
} = require('celebrate');

const regexp = /(https?:\/\/)(w{3}\.)?\w+[-.~:/?#[\]@!$&'()*+,;=]*#?/;

const {
  getUser,
  getUserById,
  getUserMe,
  updateProfile,
  updateAvatar,
  login,
  createUser,
} = require('../controllers/users');

router.post('/signin', celebrate({
  body: Joi.object()
    .keys({
      email: Joi.string()
        .required()
        .email(),
      password: Joi.string()
        .required(),
      name: Joi.string()
        .min(2)
        .max(30),
      about: Joi.string()
        .min(2)
        .max(30),
      avatar: Joi.string(),
    }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object()
    .keys({
      email: Joi.string()
        .required()
        .email(),
      password: Joi.string()
        .required()
        .min(3),
      name: Joi.string()
        .min(2)
        .max(30),
      about: Joi.string()
        .min(2)
        .max(30),
      avatar: Joi.string()
        .pattern(regexp),
    }),
}), createUser);

router.get('/users', getUser);
router.get('/users/me', getUserMe);
router.get('/users/:id', celebrate({
  params: Joi.object()
    .keys({
      userId: Joi.string()
        .required()
        .hex()
        .length(24),
    }),
}), getUserById);
router.patch('/users/me', celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string()
        .required()
        .min(2)
        .max(30),
      about: Joi.string()
        .required()
        .min(2)
        .max(30),
    }),
}), updateProfile);
router.patch('/users/me/avatar', celebrate({
  body: Joi.object()
    .keys({
      avatar: Joi.string()
        .required()
        .pattern(regexp),
    }),
}), updateAvatar);

module.exports = router;
