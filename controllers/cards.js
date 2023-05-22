const Card = require('../models/card');
const AccessDenied = require('../errors/access-denied');
const NotFoundError = require('../errors/not-found-err');
const InvalidRequest = require('../errors/invalid-request');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  // записываем данные в базу
  Card.create({ name, link, owner })
    // возвращаем записанные в базу данные пользователю
    .then((card) => res.status(201).send(card))
    // если данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new InvalidRequest('Переданы некорректные данные при создании карточки.'));
      }
      return next(err);
    });
};

module.exports.getCard = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

module.exports.cardDelete = (req, res, next) => {
  const userId = req.user._id;

  Card.findById(req.params.id)
    .orFail()
    .then((card) => {
      if (card.owner.toString() !== userId) {
        throw new AccessDenied('Вы не можете удалить эту карточку');
      }
      return Card.findByIdAndDelete(card._id);
    })
    .then((deletedCard) => res.status(200).send(deletedCard))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Карточка не найдена.'));
      }
      if (err.name === 'ValidationError') {
        return next(new InvalidRequest('Переданы не корректные данные'));
      }
      return next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).orFail(() => new NotFoundError('Пользователь с указанным id не существует'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new InvalidRequest('Переданы некорректные данные для постановки лайка.'));
      }
      return next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  ).orFail(() => new NotFoundError('Пользователь с указанным id не существует'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new InvalidRequest('Переданы некорректные данные для удаления лайка.'));
      }
      return next(err);
    });
};
