const User = require('../models/User');

const isAdmin = async (req, res, next) => {
    if(req.user && req.user.role === 'admin') {
        next();
    }else {
        res.status(403).json({message: 'Access denied: Admins only'});
    }
};

module.exports = isAdmin;