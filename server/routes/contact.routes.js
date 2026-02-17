const express = require('express');
const router = express.Router();

const { getContacts, createContact } = require('../controllers/contact.controller');
const { protect } = require('../middleware/auth.middleware');

router.route('/')
    .get(protect, getContacts)
    .post(protect, createContact);

module.exports = router;
