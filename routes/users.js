const router = require('express')
  .Router();
const {
  celebrate,
  Joi,
} = require('celebrate');
const auth = require('../middlewares/auth');

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
    }),
}), login);

router.post('/signup', celebrate({
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
}), createUser);

router.get('/users', auth, getUser);
router.get('/users/me', auth, getUserMe);
router.get('/users/:id', auth, getUserById);
router.patch('/users/me', auth, updateProfile);
router.patch('/users/me/avatar', auth, updateAvatar);

module.exports = router;
