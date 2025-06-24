const Board = require('../models/Board');
const List = require('../models/List');
const { logActivity } = require('./activityLogController');

exports.createList = async (req, res) => {
    const {title, boardId} = req.body;

    try{
        const list = await List.create({title, board: boardId});

        res.status(201).json(list);
    }catch(err){
        res.status(500).json({message: err.message});
    }
};

exports.getListsByBoard = async (req, res) => {
    const { boardId} = req.params;

    try{
        const lists = await List.find({board: boardId}).sort({order: 1}).populate({path: 'tasks', populate: {path: 'assignedTo', select: 'name email'}});
        res.json(lists);
    }catch(err){
        res.status(500).json({message: err.message});
    }
};

exports.deleteList = async (req, res) => {
    const listId = req.params.id;
    const userId = req.user._id;

    try{
        const list = await List.findById(listId);
        if(!list){
            return res.status(404).json({message:'List not found'});
        }

        const board = await Board.findById(list.board);
        if(!board){
            return res.status(404).json({message:'Board not found'});
        }

        const isAuthorized = board.owner._id.toString() === userId.toString() ||
        board.members.some((m) => m.user.toString() === userId.toString() && m.role === 'admin');

        if(!isAuthorized){
            return res.status(403).json({message: 'Not Authorized to delete this list'})
        }

        await list.deleteOne();

        await logActivity({
            boardId: board._id,
            userId,
            action: `deleted a list: ${list.title}`
        });

        res.json({message: 'List deleted successfully'});

    }catch(err){
        console.error('Error deleting list:', err);
        res.status(500).json({message: err.message});
    }
};