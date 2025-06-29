import User from '../models/User.js';

// Middleware to check if the user is authenticated

export const protect = async (req, res, next) => {
    const {userId} = req.auth
    if (!userId) {
        return res.status(401).json({message: 'Not authorized, no user found'});
    } else {
        const user = await User.findById(userId) 
        req.user = user;
        next();
    }
}