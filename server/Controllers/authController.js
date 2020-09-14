const bcrypt = require('bcrypt');
const model = require('../Models/model.js');

const authController = {};

authController.register = async (req, res, next) => {
  const {
    username,
    password,
    email,
    firstname,
    lastname,
    linkedin,
    githubhandle,
    personalpage,
    about,
  } = req.body;
  const queryText = `INSERT INTO User_credentials (username,password,email) VALUES ($1,$2,$3)`;
  const usersQueryText = `INSERT INTO Users (username, firstname, lastname, linkedin, githubhandle, personalpage, about) VALUES($1,$2,$3,$4,$5,$6,$7)`;
  const hashedPassWord = await bcrypt.hash(password, 10);
  try {
    await model.query(queryText, [username, hashedPassWord, email]);
    await model.query(usersQueryText, [
      username,
      firstname,
      lastname,
      linkedin,
      githubhandle,
      personalpage,
      about,
    ]);
    return next();
  } catch (err) {
    console.log(err);
    return next({
      log: `error occurred at register middleware. error message is: ${err}`,
      status: 400,
      message: { err: 'An error occurred' },
    });
  }
};

// ToDO : new columns in the Users table, about, linkedin, personal url
// new table to link users to tech stack(association table),
// signup new fields for firstname and lastname

// middleware for get profiles
authController.getProfile = async (req, res, next) => {
  const { username } = req.params;
  const queryText = `SELECT * FROM Users WHERE username=$1`;
  try {
    const userData = await model.query(queryText, [username]);
    [res.locals.userData] = userData.rows;
    return next();
  } catch (err) {
    console.log(err);
    return next({
      log: `error occurred at getProfile middleware. error message is: ${err}`,
      status: 400,
      message: { err: 'An error occurred' },
    });
  }
};

// middeware to edit profiles (INCOMPLETE)
authController.editProfile = async (req, res, next) => {
  const { about, githubhandle, linkedin, personalpage } = req.body;

  const { username } = req.params;
  const queryText = `UPDATE Users SET linkedin=$1, githubhandle=$2, personalpage=$3, about=$4 WHERE username=$5 RETURNING *`;

  const queryValue = [linkedin, githubhandle, personalpage, about, username];
  try {
    const userData = await model.query(queryText, queryValue);
    res.locals.userData = userData.rows[0];
    return next();
  } catch (err) {
    console.log(err);
    return next({
      log: `error occurred at getProfile middleware. error message is: ${err}`,
      status: 400,
      message: { err: 'An error occurred' },
    });
  }
};

authController.isLoggedIn = (req, res, next) => {
  if (req.user) {
    res.locals.isLoggedIn = { isLoggedIn: true };
    res.locals.user = req.user;

    // req.user.username populated for localStorage, req.user populated for github auth
    // res.locals.user = req.user.username ? req.user.username : req.user;
    next();
  } else {
    res.locals.isLoggedIn = { isLoggedIn: false };
    next();
  }
};
module.exports = authController;
