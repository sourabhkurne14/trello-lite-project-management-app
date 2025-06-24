const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
    title: {type: String, required: true},
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    members: [{
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        role: {type: String, enum: ['admin', 'member'], default: 'member'}
    }],
    createdAt: { type: Date, default: Date.now}
});

module.exports = mongoose.model('Board', boardSchema);