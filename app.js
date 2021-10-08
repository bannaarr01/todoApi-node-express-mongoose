const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

//Import routes
const taskRouter = require('./routes/taskRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.options('*', cors());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Routes
app.use('/api/v1/tasks', taskRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
