const User = require("../models/user.model");
const createError = require("../utils/createError");

const getAllUsers = async (req, res, next) => {
  const users = await User.find({ email: { $ne: req.user.email } });

  if (!users) return next(createError("No users found", 400));

  res.status(200).json({
    success: true,
    data: users,
  });
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return next(createError("No user found", 400));

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        username: req.body.username,
        email: req.body.email,
        bio: req.body.bio,
        profilePicture: req.body.profilePicture,
        role: req.body.role,
      },
      {
        new: true,
      }
    );

    if (!user) return next(createError("No user found", 400));

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) return next(createError("No user found", 400));

  res.status(200).json({
    success: true,
    message: "User deleted!",
  });
};

const getMe = async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) return next(createError("user not found", 400));

  res.status(200).json({
    success: true,
    data: user,
  });
};

const updateMe = async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      bio: req.body.bio,
      profilePicture: req.body.profilePicture,
    },
    {
      new: true,
    }
  );

  if (!user) return next(createError("user not found", 400));

  res.status(200).json({
    success: true,
    data: user,
  });
};

const deleteMe = async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      active: false,
    },
    { new: true }
  );

  if (!user) return next(createError("No user found", 400));

  res.status(200).json({
    success: true,
    data: user,
  });
};

module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getMe,
  updateMe,
  deleteMe,
};
