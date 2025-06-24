const Board = require('../models/Board');

const checkBoardAccess = async (req, res, next) => {
    const userId = req.user._id;
    const boardId = req.params.boardId || req.body.boardId;

    if (!boardId) {
        return res.status(400).json({ message: "Board Id is required" });
    }

    try {
        const board = await Board.findById(boardId);
        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }

        // console.log("Logged-in User ID:", userId.toString());
        // console.log("Board Members:", board.members.map(m => m.user.toString()));

        const isOwner = board.owner._id.toString() === userId.toString();
        // console.log("Board owner",board.owner._id);
        // console.log("userId",userId)


        const member = board.members.find(
            (m) => {
                console.log("Comparing", m.user.toString(), "with", userId.toString());
                return m.user.toString() === userId.toString()
            }
        );
        // console.log("Matched member:", member);

        if (!member && !isOwner) {
            return res.status(403).json({ message: 'Access denied. Not a Board member or owner' });
        }

        req.userRole = isOwner ? 'admin' : member.role;

        next();

    } catch (err) {
        console.error('Board access check failed:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = checkBoardAccess;