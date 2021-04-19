require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');
const usersRouter = require('./routes/users.js');
const moviesRouter = require('./routes/movies.js');
const auth = require('./middlewares/auth');
const { login, createProfile } = require('./controllers/users');
const NotFoundError = require('./errors/not-found-error');
const { DATA_BASE_PATH } = require('./utils/config');
console.log(DATA_BASE_PATH);

const app = express();
mongoose.connect( DATA_BASE_PATH, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const { PORT = 3000 } = process.env;

app.use(cors());
app.use(bodyParser.json());

app.use(helmet());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
}), createProfile);

app.use(auth);
app.use('/', usersRouter, moviesRouter);

app.use('*', (req, res, next) => {
  next(new NotFoundError('Запращиваемая страница не найдена'));
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT);
