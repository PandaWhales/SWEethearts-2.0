const express = require('express');
const path = require('path');
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
const { getTokenSourceMapRange } = require('typescript');
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
app.get('/api/loginstatus', authController.isLoggedIn, (req, res) => {
  res.json([res.locals.isLoggedIn, res.locals.user]);
});
app.get('/api/logout', (req, res) => {
  req.logout();
  res.sendStatus(200);
});

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
  (req, res) => {
    console.log('req.user', req.user);
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
