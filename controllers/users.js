const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const InvalidRequest = require('../errors/Invalid-request');
const UserIsRegister = require('../errors/user-is-register');
const ErrorAuthorization = require('../errors/error-authorization');

module.exports.login = (req, res, next) => {
  const {
    email,
    password,
  } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return next(new ErrorAuthorization('Неправильные почта или пароль.'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            // хеши не совпали — отклоняем промис
            return next(new ErrorAuthorization('Неправильные почта или пароль.'));
          }
          const token = jwt.sign(
            { _id: user._id },
            'b5581cf09f1177d89ef6a4c822b05c847d8a71eb1d9adb2949d4fab9a6edf596',
            { expiresIn: '7d' },
          );
          // аутентификация успешна
          return res.send({ _id: token });
        });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    }))
    // возвращаем записанные в базу данные пользователю
    .then((user) => {
      const doNotPassword = user.toObject({ useProjection: true });

      res.status(201)
        .send(doNotPassword);
    })

    // если данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new InvalidRequest('Переданы некорректные данные при создании пользователя.'));
      }
      if (err.code === 11000) {
        return next(new UserIsRegister('Такой пользователь уже зарегистрирован.'));
      }
      return next(err);
    });
};

module.exports.getUser = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Пользователь не найден.'));
      }
      return next(err);
    });
};

module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Пользователь не найден.'));
      }
      return next(err);
    });
};

module.exports.updateProfile = (req, res, next) => {
  const {
    name,
    about,
  } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      about,
    },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .orFail()
    .then((user) => res.status(200)
      .send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Пользователь не найден.'));
      }
      return next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .orFail()
    .then((user) => res.status(200)
      .send(user))
    .catch((err) => next(err));
};
