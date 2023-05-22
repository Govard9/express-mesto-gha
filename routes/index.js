const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const NotFoundError = require('../errors/not-found-err');

router.use(userRouter, cardRouter, (req, res, next) => {
  next(new NotFoundError('404 Not Found'));
});
module.exports = router;
