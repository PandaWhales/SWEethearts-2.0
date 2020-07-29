const LocalStrategy = require('passport-local').Strategy;
const model = require('./Models/model');
const bcrypt = require('bcrypt');
const passport = require('passport');
// to Authenticate with passport

const initialize = () => {
  passport.use(
    new LocalStrategy((username, password, done) => {
      // find same username in database
      model.query(
        `SELECT * FROM User_credentials WHERE username = $1`,
        [username],
        (err, results) => {
          if (err) {
            console.log(err, 'user_credentials error');
            return done(err);
          }
          // find and compare same password
          if (results.rows.length > 0) {
            const user = results.rows[0];
            console.log('user', user);
            bcrypt.compare(password, user.password, (error, isMatch) => {
              if (error) {
                console.log(error, 'bcrypt compare error');
                return;
              }
              // if password matched send user body
              if (isMatch) {
                console.log('match');
                done(null, user);
              } else {
                console.log('password is not matched');
                done(null, false, { message: 'password is not matched' });
              }
            });
          } else {
            done(null, false, { message: 'username is not registered' });
          }
        }
      );
    })
  );

  // about session with cookie
  passport.serializeUser((user, done) => {
    done(null, user.username);
  });
  passport.deserializeUser((username, done) => {
    model.query(
      `SELECT * FROM User_credentials WHERE username = $1`,
      [username],
      (err, results) => {
        if (err) {
          console.log(err, 'deserializeUser error');
          return done(err);
        }

        done(null, results.rows[0]);
      }
    );
  });
};

module.exports = initialize;
