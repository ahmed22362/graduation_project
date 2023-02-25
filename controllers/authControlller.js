const User = require('./../models/UserModel');
const AppError = require('./../utils/appError');
const catchAsynic = require('./../utils/catchAsynic');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsynic(async (req, res, next) => {
  // Create new user
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  const token = signToken(newUser._id);
  res.status(201).json({
    status: 'sucess',
    data: {
      user: newUser,
      token,
    },
  });
});

exports.login = catchAsynic(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if the email and password exits
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  // 2) Check if the user exist && The password is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  const token = signToken(user._id);
  // 3) If every thing okey send token to clint
  res.status(200).json({
    status: 'sucess',
    token,
  });
});
exports.protect = catchAsynic(async (req, res, next) => {
  // 1) Getting token and Check if it's true
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! please log in to get acssess.'),
      401
    );
  }
  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3) Check if the user still exist
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError("The user belong's to this token no longer exist.")
    );
  }
  // 4) Check if user change password
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! please login again.')
    );
  }

  // 5) Grant access to protected route
  req.user = freshUser;
  next();
});
