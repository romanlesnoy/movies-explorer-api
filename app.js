require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./utils/limiter');
const router = require('./routes/index');
const { DEV_DATA_BASE_PATH } = require('./utils/config');

const app = express();
const { PORT = 3000, NODE_ENV, PRODUCTION_DATA_BASE_PATH } = process.env;

mongoose.connect(NODE_ENV === 'production' ? PRODUCTION_DATA_BASE_PATH : DEV_DATA_BASE_PATH, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(cors());
app.use(bodyParser.json());

app.use(helmet());
app.use(requestLogger);
app.use(limiter);
app.use('/', router);

app.use(errorLogger);

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
