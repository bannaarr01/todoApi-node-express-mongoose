//const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // Custom Validator works on CREATE!!
      validator: function (el) {
        return el === this.password; //return boolean
      },
      message: 'Passwords are not the same!',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

//btween getting the data and saving it to db
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
 
  this.password = await bcrypt.hash(this.password, 12); 
  //this shouldn't be entered into db
  this.passwordConfirm = undefined;
  next();
});

//Instance method 
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);

  next();
};
const User = mongoose.model('User', userSchema);

module.exports = User;
