const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const router = require('./routes/index');

const app = express();

const handleErrors = require('./middlewares/handleErrors');

app.use(helmet());

app.use(express.json());
app.use(router);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to database.');
}).catch((error) => {
  console.error('Error connecting to database:', error);
});

app.use(errors()); // обработчик ошибок celebrate

app.use(handleErrors);

app.listen(3000, () => { console.log('Server started.'); });
