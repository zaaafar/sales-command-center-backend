const mongoose = require('mongoose');

const ActionSchema = new mongoose.Schema({
    meetingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meeting',
        required: true
    },
    type: {
        type: String,
        enum: ['schedule', 'followup', 'stage_update'],
        required: true
    },
    suggestedData: {
        type: mongoose.Schema.Types.Mixed, // Flexible JSON data
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Action', ActionSchema);
