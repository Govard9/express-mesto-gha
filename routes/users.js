const router = require('express').Router();

const {
  getUser,
  postUser,
  getUserById,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/users', getUser);
router.get('/users/:id', getUserById);
router.post('/users', postUser);
router.patch('/users/me', updateProfile);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
