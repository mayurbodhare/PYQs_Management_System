const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt'); 
const { Op } = require('sequelize');
const User = require('../models/User');

// Configure Passport to use LocalStrategy for authentication
passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        // Find user by username in database
        const user = await User.findOne({ where: { username: username } });

        // If user not found or password is incorrect, return error
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return done(null, false, { message: 'Incorrect username or password' });
        }

        // If user found and password is correct, return user
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

// Serialize user to store in session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        // Find user by ID in database
        const user = await User.findByPk(id);

        // If user not found, return error
        if (!user) {
            return done(null, false);
        }

        // If user found, return user
        return done(null, user);
    } catch (error) {
        return done(error);
    }
});

// Controller actions for authentication
const authController = {
    // Register action
    register: async (req, res, next) => {
        try {
            const { username, password, email } = req.body;

            // Check if username or email already exists
            const existingUser = await User.findOne({
                where: {
                    [Op.or]: [{ username: username }, { email: email }]
                }
            });

            if (existingUser) {
                return res.status(400).json({ message: 'Username or email already exists' });
            }

            // Create new user
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({
                username: username,
                password: hashedPassword,
                email: email
            });

            res.json({ message: 'User registered successfully', user: newUser });
        } catch (error) {
            next(error);
        }
    },

    // Login action
    login: (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(401).json({ message: info.message });
            }
            req.login(user, (err) => {
                if (err) {
                    return next(err);
                }
                return res.json({ message: 'Login successful', user: user });
            });
        })(req, res, next);
    },

    // Logout action
    logout: (req, res) => {
        if(req.isAuthenticated()){
            req.logout((err) => {
                if (err) {
                    return res.status(500).json({ message: 'Logout failed' });
                }
                res.json({ message: 'Logout successful' });
            });
        }else{
            res.json({ message: 'No one is logged in...' });
        }
        
    },

    // Check authentication status
    isAuthenticated: (req, res) => {
        if (req.isAuthenticated()) {
            res.json({ isAuthenticated: true, user: req.user });
        } else {
            res.json({ isAuthenticated: false });
        }
    }
};

module.exports = authController;
