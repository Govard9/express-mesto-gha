const router = require('express')
  .Router();
const {
  celebrate,
  Joi,
} = require('celebrate');
const auth = require('../middlewares/auth');

const regexp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

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

router.get('/users', auth, getUser);
router.get('/users/me', auth, getUserMe);
router.get('/users/:id', auth, celebrate({
  params: Joi.object()
    .keys({
      id: Joi.string()
        .required()
        .hex()
        .length(24),
    }),
}), getUserById);
router.patch('/users/me', auth, celebrate({
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
router.patch('/users/me/avatar', auth, celebrate({
  body: Joi.object()
    .keys({
      avatar: Joi.string()
        .required()
        .pattern(regexp),
    }),
}), updateAvatar);

module.exports = router;
