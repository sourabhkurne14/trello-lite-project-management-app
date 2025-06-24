const mongoose = require('mongoose')

const listSchema = new mongoose.Schema({
    title: {type: String, required: true},
    board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true},
    order: {type: Number, default: 0}
},{timestamps: true}
);

listSchema.virtual('tasks',{
    ref: 'Task',
    localField: '_id',
    foreignField: 'list',
    justOne: false, 
});

listSchema.set('toObject', {virtuals: true});
listSchema.set('toJSON', {virtuals: true});

module.exports = mongoose.model('List', listSchema);