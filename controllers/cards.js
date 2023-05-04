const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body || {};
  const owner = req.user._id;

  if (!name || !link) {
    res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
    return;
  }

  // записываем данные в базу
  Card.create({ name, link, owner })
    // возвращаем записанные в базу данные пользователю
    .then((card) => res.status(200).send(card))
    // если данные не записались, вернём ошибку
    .catch(() => res.status(500).send({ message: 'Ошибка запроса.' }));
};

module.exports.getCard = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => res.status(500).send({ message: 'Ошибка запроса.' }));
};

module.exports.cardDelete = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .orFail(new Error('notValidCardForDelete'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.message === 'notValidCardForDelete') {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
      } else {
        res.status(500).send({ message: 'Ошибка запроса.' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  if (!req.params.id) {
    res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка.' });
    return;
  }

  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).orFail(new Error('notValidLikeForCard'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.message === 'notValidLikeForCard') {
        res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
      } else {
        res.status(500).send({ message: 'Ошибка запроса.' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  if (!req.params.id) {
    res.status(400).send({ message: 'Переданы некорректные данные для удаления лайка.' });
    return;
  }

  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  ).orFail(new Error('notValidDeleteLike'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.message === 'notValidDeleteLike') {
        res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
      } else {
        res.status(500).send({ message: 'Ошибка запроса.' });
      }
    });
};
