const Task = require('./../models/taskModel');

exports.createTask = async (req, res, next) => {
  try {
    const newTask = await Task.create(req.body);

    res.status(200).json({
      status: 'success',
      data: {
        task: newTask,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data',
    });
    next();
  }
};

exports.getAllTasks = async (req, res, next) => {
  try {
    //BUILD QUERY
    //destructuring
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    const query = Task.find(queryObj);

    //EXECUTE QUERY
    const tasks = await query;

    res.status(200).json({
      status: 'success',
      data: {
        tasks,
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

exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    //Task.findOne({_id: req.params.id})
    res.status(200).json({
      status: 'success',
      data: {
        task,
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

exports.updateTask = async (req, res, next) => {
  try {
    //return d new doc
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        task,
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

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
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
