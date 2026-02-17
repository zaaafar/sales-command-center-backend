const mongoose = require('mongoose');

const MeetingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a meeting title']
    },
    contactId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact',
        required: true
    },
    dateTime: {
        type: Date,
        required: true
    },
    transcript: {
        type: String,
        default: ''
    },
    aiSummary: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Meeting', MeetingSchema);
