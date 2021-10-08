const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    //Task.findOne({_id: req.params.id})

    //get d new user id, D secret and expiration
    // const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    //   expiresIn: process.env.JWT_EXPIRES_IN,
    // });
    const token = signToken(newUser._id);

    res.status(201).json({
      token,
      status: 'success',
      data: {
        newUser,
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

exports.login = async (req, res, next) => {
  try {
    //const email = req.body.email
    const { email, password } = req.body;

    //Check if the email and password exist
    if (!email || !password) {
      return next(
        res.status(400).json({
          status: 'fail',
          message: 'Please provide email and password!',
        })
      );
    }
    // const user = User.findOne({email: email}) from db
    const user = await User.findOne({ email }).select('+password');
    //reslt of queryin d model
    //explicitly select d password

    //pass from { email, password } and password from return query result
    //compare the password
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(
        res.status(401).json({
          status: 'fail',
          message: 'Invalid Credentials!',
        })
      );
    }
   
    const token = signToken(user._id);
    res.status(200).json({
      status: 'success',
      message: 'Logged in successfully',
      token,
    });

  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
    next();
  }
};

//Can implement the below in the app Error
// const handleJWTError = function () {
//   res.status(401).json({
//     status: 'fail',
//     message: 'Invalid token. Please log in again!',
//   });
// };

// const handleJWTExpiredError = function () {
//   res.status(401).json({
//     status: 'fail',
//     message: 'Your token has expired! Please log in again',
//   });
// };

// if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
// const handleJWTError = () => new AppError('Invalid token. Please log in again!', 401);
// if (error.name === 'JsonWebTokenError') error = handleJWTError();

exports.protect = async (req, res, next) => {
  let token;
  try {
    //Getting token and check if its there
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]; //take d bearer token
    }
    if (!token) {
      return next(
        res.status(401).json({
          status: 'fail',
          message: 'You are not logged in! Please log in to continue...',
        })
      );
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //check if user still exists
    //console.log(decoded) //result
    // {
    //   "id": "615fa2fe58f23a2d5896b251", //user id in d database then take d id
    //   "iat": 1633657698,
    //   "exp": 1641433698
    // }
    const currentUser = await User.findById(decoded.id); //take d id and find
    if (!currentUser) {
      return next(
        res.status(401).json({
          status: 'fail',
          message: 'The user belonging to this token does no longer exist',
        })
      );
    }
    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;

    //err if token is wrong
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      message: 'Unauthenticated',
    });
    next();
  }

  next();
};

//array of roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        res.status(403).json({
          //forbidden
          status: 'fail',
          message: 'You do not have permission to perform this action',
        })
      );
    }
    next();
  };
};
