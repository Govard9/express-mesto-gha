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
      avatar: Joi.string()
        .pattern(regexp),
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
      avatar: Joi.string(),
    }),
}), createUser);

router.get('/users', auth, getUser);
router.get('/users/me', auth, getUserMe);
router.get('/users/:id', celebrate({
  params: Joi.object()
    .keys({
      userId: Joi.string()
        .required()
        .hex()
        .length(24),
    }),
}), auth, getUserById);
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
}), auth, updateProfile);
router.patch('/users/me/avatar', celebrate({
  body: Joi.object()
    .keys({
      avatar: Joi.string()
        .required()
        .pattern(regexp),
    }),
}), auth, updateAvatar);

module.exports = router;
