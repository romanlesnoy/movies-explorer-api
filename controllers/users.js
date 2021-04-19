const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const ValidationError = require('../errors/validation-error');
const ConflictError = require('../errors/conflict-error');
const { DEV_JWT_SECRET } = require('../utils/config');
console.log(DEV_JWT_SECRET);

const getUser = (req, res, next) => {
  const id = req.user._id;
  User.findById(id)
    .orFail(() => {
      throw new NotFoundError('Данные не найдены');
    })
    .then((user) => {
      res.status(200).send({
        email: user.email,
        name: user.name,
      });
    })
    .catch((err) => next(err));
};

const updateProfile = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    { runValidators: true, new: true },
  )
    .orFail(() => {
      throw new ValidationError('Переданы неверные данные');
    })
    .then((updateData) => {
      res.status(200).send({
        newEmail: updateData.email,
        newName: updateData.name,
      });
    })
    .catch((err) => {
      next(err);
    });
};

const createProfile = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => {
      res.status(200).send({
        message: 'Регистрация прошла успешно',
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'MongoError') {
        next(new ConflictError('Такой пользователь уже существует'));
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : DEV_JWT_SECRET, {
        expiresIn: '7d',
      });
      res.status(200).send({ token });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getUser,
  updateProfile,
  createProfile,
  login,
};
