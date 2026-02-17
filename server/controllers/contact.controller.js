const Contact = require('../models/Contact');

// @desc    Get all contacts
// @route   GET /api/contact
// @access  Public
const getContacts = async (req, res, next) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: contacts.length,
            data: contacts
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new contact
// @route   POST /api/contact
// @access  Public
const createContact = async (req, res, next) => {
    try {
        const contact = await Contact.create(req.body);
        res.status(201).json({
            success: true,
            data: contact
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getContacts,
    createContact
};
