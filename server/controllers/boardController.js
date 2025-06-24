const Board = require('../models/Board');
const User = require('../models/User');

exports.createBoard = async (req, res) => {
    const { title } = req.body;

    try {
        const board = await Board.create({
            title,
            owner: req.user.id,
            members: [
                {
                    user: req.user.id,
                    role: 'admin'
                }
            ]
        });
        res.status(201).json(board);
        // console.log("Board created with members:", board.members);

    } catch (err) {
        console.error('Error creating board:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.getBoards = async (req, res) => {
    try {
        
        const boards = await Board.find({ owner: req.user.id });

        res.json(boards);

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
};

exports.getBoardById = async (req, res) => {
    try {
        // console.log("User in request:", req.user);
        // console.log("Board ID:", req.params.id);

        const board = await Board.findById(req.params.id).populate('owner', 'name email').populate('members.user', 'name email');

        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }

        const userId = req.user._id.toString();
        const isOwner = board.owner._id.toString() === userId;
        // console.log('boardowner', board.owner.toString())
        const isMember = board.members.some(member => member.user._id.toString() === userId);
        // const isMember = board.members.some(member => member.user.toString() === userId);
        
        if(!isOwner && !isMember) {
            return res.status(403).json({message: 'Access denied'});
        }

        res.status(200).json(board);
    } catch (err) {
        console.error("Error fetching board:", err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteBoard = async (req, res) => {
     try{
        const board = await Board.findById(req.params.id);

        if(!board){
            return res.status(404).json({message: 'Board not found'});
        }

        const userId = req.user.id.toString();
        const isOwner = board.owner._id.toString() === userId;
        const isAdmin = req.user.role === 'admin';

        if(!isOwner && !isAdmin){
            return res.status(403).json({message: 'Only admin or board owner can delete'});
        }

        await board.deleteOne();
        res.status(200).json({message: 'Board deleted'});
    }catch(err){
        res.status(500).json({message: 'Server error'});
    }
};

exports.addMember = async (req, res) => {
    const {boardId} = req.params;
    const {email, role} = req.body;

    try{
        const board = await Board.findById(boardId);
        if(!board){
            return res.status(404).json({message: 'Board not found'});
        }

        const isAdmin = board.members.find(
            (m) => m.user.toString() === req.user._id.toString() && m.role === 'admin'
        );
        if(!isAdmin && board.owner._id.toString() !== req.user._id.toString()){
            return res.status(403).json({message: 'Not authorized'});
        }

        const userToAdd = await User.findOne({email});
        if(!userToAdd){
            return res.status(404).json({message: 'User not found'});
        }

        const alreadyMember = board.members.some(
            (m) => m.user.toString() === userToAdd._id.toString()
        );
        if(alreadyMember){
            return res.status(400).json({message: 'User is already a member'});
        }

        board.members.push({user: userToAdd._id, role: role || 'member'});
        await board.save();

        res.status(200).json({message: 'Member added successfully'});
    }catch(err){
        console.error('Error adding member:', err);
        res.status(500).json({message: 'Server error'})
    }
};

exports.updateMemberRole = async (req, res) => {
    const {boardId, memberId} = req.params;
    const {newRole} = req.body;

    try{
        const board = await Board.findById(boardId);
        if(!board) return res.status(404).json({message: 'Board not found'});

        const requestingUser = req.user._id.toString();
        const isAdmin = board.members.some(
            (m) => m.user.toString() === requestingUser && m.role === 'admin'
        );

        if(!isAdmin && board.owner.toString() !== requestingUser){
            return res.status(403).json({message: 'Not authorized'});
        }

        const member = board.members.find(m => m.user.toString() === memberId);
        if(!member){
            return res.status(404).json({message: 'Member not found'})
        }

        member.role = newRole;
        await board.save();

        res.status(200).json({message: 'Role updated successfully'});
    }catch(err){
        res.status(500).json({message: err.message});
    }
};