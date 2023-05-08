const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const router = require('./routes/index');
const { login, createUser } = require('./controllers/users');

const app = express();

app.use(helmet());

app.use((req, res, next) => {
  req.user = {
    _id: '64510882b2fd3f542e7542eb',
  };

  next();
});
app.use(express.json());
app.post('/signin', login);
app.post('/signup', createUser);
app.use(router);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to database.');
}).catch((error) => {
  console.error('Error connecting to database:', error);
});

app.listen(3000, () => { console.log('Server started.'); });
