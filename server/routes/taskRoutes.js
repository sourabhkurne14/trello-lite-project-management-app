const express = require('express')
const router = express.Router()
const {createTask, getTasksByBoard, moveTaskToList, deleteTask} = require('../controllers/taskController');
const checkBoardAccess = require('../middlewares/checkBoardAccess');


const protect = require('../middlewares/authMiddleware');


router.post('/', protect, checkBoardAccess, createTask);
router.get('/board/:boardId', protect, checkBoardAccess, getTasksByBoard);
router.put('/:taskId/move', protect, moveTaskToList);
router.delete('/:taskId', protect, deleteTask);



module.exports = router;