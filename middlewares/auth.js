const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  let payload;

  try {
    payload = jwt.verify(token, 'b5581cf09f1177d89ef6a4c822b05c847d8a71eb1d9adb2949d4fab9a6edf596');
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
