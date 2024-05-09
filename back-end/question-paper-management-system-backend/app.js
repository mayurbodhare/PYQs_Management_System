const express = require('express');
const sequelize = require('./config/database'); // Import Sequelize instance
const authRoutes = require('./routes/authRoutes'); // Import authentication routes
const questionPaperRoutes = require('./routes/questionPaperRoutes'); // Import question paper routes
const session = require('express-session');
const passport = require('passport');


const app = express();
const port = process.env.PORT || 3000;

app.use(session({
  secret: 'mayur', // Change this to a secret key for session encryption
  resave: false,
  saveUninitialized: false
}));

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());

// Middleware
app.use(express.urlencoded({ extended: true })); // Similar to bodyParser.urlencoded({ extended: false })
app.use(express.json());                           // Similar to bodyParser.json()

// Routes
app.use('/api/auth', authRoutes); // Prefix auth routes with /api/auth
// app.use('/api/question-papers', questionPaperRoutes); // Prefix question paper routes with /api/question-papers

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start server
sequelize.sync() // Sync Sequelize models with database
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Unable to sync database:', error);
  });
