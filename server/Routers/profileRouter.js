const express = require('express');
const authController = require('../Controllers/authController.js');

const router = express.Router();

// get router for explore page
router.get('/:username', authController.getProfile, (req, res) => {
  res.json(res.locals.userData);
});

module.exports = router;
