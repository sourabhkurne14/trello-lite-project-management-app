const express = require('express');
const router = express.Router();
const { createBoard, getBoards, getBoardById, deleteBoard, addMember, updateMemberRole} = require('../controllers/boardController');
const checkBoardAccess = require('../middlewares/checkBoardAccess');

const protect = require('../middlewares/authMiddleware.js');


router.post('/', protect, createBoard);
router.get('/', protect, getBoards);
router.get('/:id', protect, getBoardById);
router.delete('/:id', protect, deleteBoard);
router.post('/:boardId/members', protect, addMember);
router.get('/:boardId', protect, checkBoardAccess)
router.put('/:boardId/members/:memberId/role', protect, updateMemberRole);

module.exports = router;