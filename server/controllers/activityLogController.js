const ActivityLog = require('../models/ActivityLog');

const logActivity = async ({ boardId, userId, action, taskId}) => {
    try{
        await ActivityLog.create({
            board: boardId,
            user: userId,
            action,
            task: taskId || undefined,
        });
        console.log('Fetching logs for board:', boardId);

    }catch(err){
        console.error('Activity log Failed:', err.message);
    }
};

const getActivityLogsByBoard = async (req, res) => {
    const {boardId} = req.params;

    try{
        const logs = await ActivityLog.find({board: boardId}).populate('user', 'name').populate('task', 'title').sort({createdAt: -1});

        res.json(logs);

    }catch(err){
        res.status(500).json({message: 'Error fetching activity logs'})
    }
};

module.exports = {logActivity, getActivityLogsByBoard};