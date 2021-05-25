const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const auth = require('../middlewares/auth');
const { login, createProfile } = require('../controllers/users');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const NotFoundError = require('../errors/not-found-error');
const { NOT_FOUND_PAGE_MESSAGE } = require('../utils/responseMesseges');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
}), createProfile);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

router.use('/users', auth, usersRouter);

router.use('/movies', auth, moviesRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError(NOT_FOUND_PAGE_MESSAGE));
});

module.exports = router;
