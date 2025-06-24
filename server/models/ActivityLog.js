const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    board: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    action: {
        type: String, required: true
    },
    task: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Task'
    }
}, {timestamps: true}
)

module.exports = mongoose.model('ActivityLog', activityLogSchema);