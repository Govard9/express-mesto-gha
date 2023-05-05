const User = require('../models/user');

module.exports.postUser = (req, res) => {
  const { name, about, avatar } = req.body;

  // записываем данные в базу
  User.create({ name, about, avatar })
    // возвращаем записанные в базу данные пользователю
    .then((user) => res.status(201).send(user))
    // если данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.getUser = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      res.status(500).send({ message: 'Произошла ошибка.' });
    });
};

module.exports.getUserById = (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Передан некорректный id пользователя.' });
        return;
      }
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Нет пользователя с таким id.' });
        return;
      }
      res.status(500).send({ message: 'Ошибка запроса.' });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body || {};

  if (!name || !about) {
    res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
    return;
  }

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'CastError') {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
      } else {
        res.status(500).send({ message: 'Ошибка запроса.' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body || {};

  if (!avatar) {
    res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
    return;
  }

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'CastError') {
        res.status(404).send({ message: 'Такого пользователя не существует.' });
      } else {
        res.status(500).send({ message: err.errors.avatar.message });
      }
    });
};
