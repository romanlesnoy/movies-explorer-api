const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');
const ValidationError = require('../errors/validation-error');
const {
  NOT_FOUND_DATA_MESSAGE,
  NO_ACCESS_RIGHTS_MESSAGE,
  SUCCSESS_DELETE_MESSAGE,
  SUCCSESS_CREATE_MESSAGE,
} = require('../utils/responseMesseges');

const getMovies = (req, res, next) => {
  const { _id } = req.user;
  Movie.find({ owner: _id }).select('-owner')
    .then((movies) => res.status(200).send(movies))
    .catch((err) => next(err));
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  })
    .then(() => {
      res.status(200).send({
        message: SUCCSESS_CREATE_MESSAGE,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(err.message));
      }
    })
    .catch((err) => {
      next(err);
    });
};

const deleteMovie = (req, res, next) => {
  const owner = req.user._id;
  Movie.findOne({ _id: req.params.movieId })
    .orFail(() => {
      throw new NotFoundError(NOT_FOUND_DATA_MESSAGE);
    })
    .then((movie) => {
      if (String(movie.owner) !== owner) {
        throw new ForbiddenError(NO_ACCESS_RIGHTS_MESSAGE);
      }
      return Movie.findByIdAndRemove(movie._id).select('-owner');
    })
    .then((movie) => {
      res.status(200).send({
        message: SUCCSESS_DELETE_MESSAGE,
        deleteMovie: movie,
      });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
