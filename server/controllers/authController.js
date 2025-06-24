const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken.js');

exports.register = async (req, res) => {
    const {name, email, password} = req.body;
    try{
        const userExists = await User.findOne({email});
        if(userExists) return res.status(400).json({ message: 'user already exists'});

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword});

        const token = generateToken(user._id);
        res.status(201).json({token, user: {id: user._id, name, email}});

    }catch(err) {
        res.status(500).json({ message: err.message});
    }
};

exports.login = async (req, res) => {

    const { email, password} = req.body;

    try{
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = generateToken(user._id);
        res.json({ token, user: {id: user._id, name: user.name, email}});
        
    }catch(err){
        res.status(500).json({message: err.message});
    }
};

