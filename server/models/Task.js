const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    title: {type: String, required: true, trim: true},
    description: {type: String, default: ''},
    board: {type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true},
    list: {type: mongoose.Schema.Types.ObjectId, ref: 'List', required: true},
    assignedTo: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    status: {type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo'},
    order: {type: Number, default: 0}
}, {timestamps: true}
);

module.exports = mongoose.model('Task', taskSchema)