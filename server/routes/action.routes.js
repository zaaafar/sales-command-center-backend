const express = require('express');
const router = express.Router();

const { confirmAction } = require('../controllers/action.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/confirm', protect, confirmAction);

module.exports = router;
