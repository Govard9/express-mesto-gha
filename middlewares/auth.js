const jwt = require('jsonwebtoken');
const ErrorAuthorization = require('../errors/error-authorization');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new ErrorAuthorization('Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, 'b5581cf09f1177d89ef6a4c822b05c847d8a71eb1d9adb2949d4fab9a6edf596');
  } catch (err) {
    return next(new ErrorAuthorization('Необходима авторизация'));
  }
  req.user = payload;
  return next();
};
