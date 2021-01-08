var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var userModel = require('../model/thanhvien.model');
var bcrypt = require('bcryptjs');

module.exports = function (app) {
  app.use(passport.initialize());
  app.use(passport.session());

  var ls = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, (email, password, done) => {
    userModel.getPassbyEmail(email).then(rows => {
      if (rows.length === 0) {
        return done(null, false, { message: 'Tài khoản không chính xác!' })
      }

      var user = rows[0];
      var ret = bcrypt.compareSync(password, rows[0].matKhau);

      if (ret) {
        return done(null, user);
      }
      return done(null, false, { message: 'Tài khoản không chính xác!' })

    }).catch(err => {
      return done(err, false);
    })
  });


  passport.use(ls);

  passport.serializeUser((user, done) => {
    return done(null, user);
  });

  passport.deserializeUser((user, done) => {
    return done(null, user);
  });

}

