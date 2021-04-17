const { Schema, model } = require('mongoose');
const isEmail = require('validator/lib/isEmail');
// const bcrypt = require("bcrypt");
// const AuthError = require("../errors/auth-error");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return isEmail(v);
      },
      message: 'Введите корректный email',
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

// userSchema.statics.findUserByCredentials = function (email, password) {
//   return this.findOne({ email })
//     .select("+password")
//     .then((user) => {
//       if (!user) {
//         return Promise.reject(new AuthError("Неправильные почта или пароль"));
//       }

//       return bcrypt.compare(password, user.password).then((matched) => {
//         if (!matched) {
//           return Promise.reject(new AuthError("Неправильные почта или пароль"));
//         }
//         return user;
//       });
//     });
// };

module.exports = model('user', userSchema);
