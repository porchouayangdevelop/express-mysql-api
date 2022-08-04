const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan')('dev');
// const logger = require('logger');
require('dotenv').config();
const app = express();

// connect to the database
const db = require('./config/config').connect();
db.connect((err) => {
    err ? console.log(err) : console.log(`Connected to database at ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
});


// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan);

// set CORS headers on response
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// set Content-Type for all responses
app.use((req, res, next) => {
    res.contentType('application/json');
    next();
});

// set method headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});

// Routes
const authRoutes = require('./routes/auth/auth.routes');
const userRoutes = require('./routes/auth/user.routes');

// use routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);


// error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err);
});


// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port http://localhost:${port}`);
});