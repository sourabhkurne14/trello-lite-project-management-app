const express = require('express')
const router = express.Router();

const {getActivityLogsByBoard} = require('../controllers/activityLogController');
const protect = require('../middlewares/authMiddleware')

router.get('/:boardId', protect, getActivityLogsByBoard);

module.exports = router;