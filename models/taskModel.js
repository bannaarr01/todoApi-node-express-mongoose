const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A task must have title'],
    unique: true,
    trim: true,
    minlength: [5, 'A task title must have less or equal then 5 characters'],
  },
  description: {
    type: String,
    required: [true, 'A task must have description'],
    trim: true,
    minlength: [10, 'A task request must have less or equal then 10 characters'],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Task = mongoose.model('Task', taskSchema); //Task Model

module.exports = Task;
