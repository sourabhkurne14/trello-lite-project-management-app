const Task = require('../models/Task');
const Board = require('../models/Board');
const User = require('../models/User');
const { logActivity } = require('./activityLogController');


exports.createTask = async (req, res) => {
    const { title, listId, boardId, assignedTo } = req.body;
    const userId = req.user._id;

    if (!title || !listId || !boardId) {
        return res.status(400).json({ message: 'Title, listId, and boardId are required' });
    }

    try {

        const board = await Board.findById(boardId);
        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }

        const isMember = board.members.some(member => member.user.toString() === userId.toString()) || board.owner.toString() === userId.toString();
        if (!isMember) {
            return res.status(403).json({ message: 'You are not a member of this board' })
        }

        if (assignedTo) {
            const userToAssign = await User.findById(assignedTo);
            if (!userToAssign) {
                return res.status(404).json({ message: 'Assigned user not found' });
            }

            const isAssignedMember = board.members.some(member => member.user.toString() === assignedTo.toString()) || board.owner.toString() === assignedTo.toString;
            if (!isAssignedMember) {
                return res.status(403).json({ message: 'Assigned user is not a member of this board' })
            }
        }


        const task = await Task.create({
            title,
            list: listId,
            board: boardId,
            assignedTo: assignedTo || null
        });

        
        const populatedTask = await task.populate('assignedTo', 'name')

        await logActivity({
            boardId,
            userId: req.user._id,
            action: `created a task: ${task.title}`,
            taskId: task._id
        });

        res.status(201).json(populatedTask);
    } catch (err) {
        console.error('Error creating task:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.getTasksByBoard = async (req, res) => {
    const { boardId } = req.params;

    try {
        const tasks = await Task.find({ board: boardId }).populate('assignedTo', 'name email');
        res.status(200).json(tasks);
    } catch (err) {
        console.err('Error fetching tasks:', err);
        res.status(500).json({ message: 'Failed to fetch tasks' });
    }
};

exports.moveTaskToList = async (req, res) => {
    try {
        const { listId } = req.body;
        const task = await Task.findById(req.params.taskId);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        task.list = listId;
        await task.save();

        res.json({ message: 'Task moved successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteTask = async (req, res) => {
    const {taskId} = req.params;
    const userId = req.user._id;

    try{
        const task = await Task.findById(taskId);
        if(!task) {
            return res.status(404).json({message: 'Task not found'});
        }

        const board = await Board.findById(task.board);
        if(!board){
            return res.status(404).json({message: 'Board not found'});
        }

        const isAuthorized = board.owner._id.toString() === userId.toString() ||
        board.members.some((m) => m.user.toString() === userId.toString() && m.role === 'admin');

        if(!isAuthorized){
            return res.status(403).json({message: 'Not authorized to delete this task'})
        }

        await task.deleteOne();

        await logActivity({
            boardId: board._id,
            userId: userId,
            action: `deleted a task: ${task.title}`,
            taskId: task._id
        });

        res.json({message: 'Task deleted successfully'});
    }catch(err){
        console.error('Error deleting task:', err);
        res.status(500).json({message: err.message});
    }
};