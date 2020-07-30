const express = require('express');
const authController = require('../Controllers/authController.js');

const router = express.Router();

// get router for explore page
router.get('/:username', authController.getProfile, (req, res) => {
  // console.log('res.locals.ideas', res.locals.ideas);
  // console.log(res.locals.userData)
  res.json(res.locals.userData);
});

router.put('/:username', authController.editProfile, (req, res) => {
  console.log('in editprofile router')
  res.json(res.locals.userData)
}) 

module.exports = router;
