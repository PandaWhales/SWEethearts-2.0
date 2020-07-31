const express = require('express');
const path = require('path');
//email api
const sgMail = require('@sendgrid/mail');
const cors = require('cors');

const app = express();
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const model = require('./Models/model');
const signUpRouter = require('./Routers/signupRouter');
const exploreRouter = require('./Routers/exploreRouter');
const submitRouter = require('./Routers/submitRouter');
const loginRouter = require('./Routers/loginRouter');
const profileRouter = require('./Routers/profileRouter');
const authController = require('./Controllers/authController');

// import Github strategy
const GitHubStrategy = require('passport-github').Strategy;
const flash = require('express-flash');
const initializePassport = require('./passport');
const passport = require('passport');
initializePassport(passport);
require('dotenv').config();
const PORT = 3000;

const corsOptions = {
  origin: true,
  preflightContinue: true,
  optionsSuccessStatus: 200,
};
/*
 * Handle parsing request body
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use('/api/login', loginRouter);
app.use('/api/signup', signUpRouter);
app.use('/api/explore', exploreRouter);
app.use('/api/submit', submitRouter);
app.use('/api/profile', profileRouter);

//sweethearts 2.0 routes
app.get('/api/loginstatus', authController.isLoggedIn, (req, res) => {
  res.json([res.locals.isLoggedIn, res.locals.user]);
});

app.get('/api/logout', (req, res) => {
  req.logout();
  res.sendStatus(200);
});

//route for email api
app.post('/api/sendEmail', sendEmail, (req, res) => {
  res.status(200).json('hi');
});

//email api integration
function sendEmail(req, res, next) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const { email, message } = req.body;
  const sub = req.body.subject;
  const msg = {
    to: email,
    from: 'sweetheartsPandaWhale@gmail.com',
    subject: sub,
    text: message,
    html: `<p>${message}</p>`,
  };
  sgMail.send(msg, (error, result) => {
    if (error) {
      console.log(error.response.body.errors);
    } else {
      console.log(result);
    }
  });
  next();
}

// Github OAuth handler
// console.log(process.env.gitHubClientId, process.env.gitHubClientSecret);
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.gitHubClientId,
      clientSecret: process.env.gitHubClientSecret,
      callbackURL: 'http://localhost:8080/api/auth/github/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get('/api/auth/github', (req, res) => {
  const githubURL = `https://github.com/login/oauth/authorize?client_id=${process.env.gitHubClientId}&redirect_uri=http://localhost:8080/api/auth/github/callback`;
  res.redirect(githubURL);
});
app.get(
  '/api/auth/github/callback',
  passport.authenticate('github', {
    failureRedirect: 'http://localhost:8080/login',
  }),
  async (req, res, next) => {
    console.log('req.user in callback', req.user);
    const credQueryText = `INSERT INTO User_credentials (username, password) VALUES ($1, $2) ON CONFLICT DO NOTHING`;
    const userQueryText =
      'INSERT INTO Users (username, githubhandle, firstname, lastname) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING';

    const firstname = req.user.displayName.split(' ')[0];
    const lastname = req.user.displayName.split(' ')[1];
    try {
      // saves username as username, id as password, email
      // email may need to be changed in the database to not required
      // github has features to hid emails
      await model.query(credQueryText, [req.user.username, req.user.id]);
      await model.query(userQueryText, [req.user.username, req.user.username, firstname, lastname]);
      return next();
    } catch (err) {
      console.log(err);
      return next({
        log: `error occurred at github callback middleware. error message is: ${err}`,
        status: 400,
        message: { err: 'An error occurred' },
      });
    }
  },
  (req, res) => {
    res.redirect('/explore');
  }
);
// globoal error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

/*
 * Start server
 */
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = app;
