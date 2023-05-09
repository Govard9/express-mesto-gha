const router = require('express').Router();

const {
  getUser,
  getUserById,
  getUserMe,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/users', getUser);
router.get('/users/me', getUserMe);
router.get('/users/:id', getUserById);
router.patch('/users/me', updateProfile);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
