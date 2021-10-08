const User = require('./../models/userModel');

exports.getAllusers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: 'success',
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
    next();
  }
  next();
};

exports.updateMe = (req, res, next) => {
	//complete your code here.....
  res.status(500).json({
    status: 'error',
    message: 'undefine route',
  });
};

exports.updateUser = (req, res) => {
	//complete your code here.....
  res.status(500).json({
    status: 'error',
    message: 'undefine route',
  });
};

exports.deleteUser = (req, res) => {
	//complete your code here.....
  res.status(500).json({
    status: 'error',
    message: 'undefine route',
  });
};
