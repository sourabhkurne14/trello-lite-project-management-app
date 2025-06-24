const express = require('express');
const router = express.Router();

const {createList, getListsByBoard, deleteList} = require('../controllers/listController');
const checkBoardAccess = require('../middlewares/checkBoardAccess');
const protect = require('../middlewares/authMiddleware');

router.post('/', protect, createList);
router.get('/board/:boardId', protect, getListsByBoard);
router.delete('/:id', protect,  deleteList);

module.exports = router;
