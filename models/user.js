const { Schema, model } = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcrypt');
const AuthError = require('../errors/auth-error');
const { AUTH_DATA_ERROR_MESSAGE, INVALID_DATA_MESSAGE } = require('../utils/responseMesseges');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return isEmail(v);
      },
      message: (props) => `${props.value}. ${INVALID_DATA_MESSAGE}`,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthError(AUTH_DATA_ERROR_MESSAGE));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new AuthError(AUTH_DATA_ERROR_MESSAGE));
        }
        return user;
      });
    });
};

module.exports = model('user', userSchema);
