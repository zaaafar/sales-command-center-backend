const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    company: {
        type: String,
        required: [true, 'Please add a company']
    },
    email: {
        type: String,
        required: [true, 'Please add an email']
    },
    dealStage: {
        type: String,
        default: 'Discovery'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Contact', ContactSchema);
