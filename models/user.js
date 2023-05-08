const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    email: {
      required: [true, 'Поле name обязательно к заполнению.'],
      unique: [true, 'Такой email уже использует кто-то другой.'],
      validate: {
        validator: (v) => validator.isEmail(v),
        message: 'Некорректный URL.',
      },
    },
    password: {
      required: [true, 'Поле name обязательно к заполнению.'],
    },
    name: {
      type: String,
      required: [true, 'Поле name обязательно к заполнению.'],
      minlength: [2, 'Минимальная длинна поля - 2 символа.'],
      maxlength: [30, 'Максимальная длинна поля - 30 символов.'],
    },
    about: {
      type: String,
      required: [true, 'Поле name обязательно к заполнению.'],
      minlength: [2, 'Минимальная длинна поля - 2 символа.'],
      maxlength: [30, 'Максимальная длинна поля - 30 символов.'],
    },
    avatar: {
      type: String,
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'Некорректный URL.',
      },
      required: [true, 'Поле name обязательно к заполнению.'],
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('user', userSchema);
