const router = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getUser,
  getUserById,
  getUserMe,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/users', auth, getUser);
router.get('/users/me', auth, getUserMe);
router.get('/users/:id', auth, getUserById);
router.patch('/users/me', auth, updateProfile);
router.patch('/users/me/avatar', auth, updateAvatar);

module.exports = router;
