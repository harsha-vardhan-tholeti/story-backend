const User = require("../models/user.model");
const crypto = require("crypto");
const createError = require("../utils/createError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/email");

const register = async (req, res, next) => {
  try {
    const { username, email, password, bio, profilePicture } = req.body;

    console.log(username);

    if (!username) {
      return next(createError("Please enter a username", 400));
    } else if (!email) {
      return next(createError("Please enter a email", 400));
    } else if (!password) {
      return next(createError("Please enter a password", 400));
    }

    const user = await User.create({
      username,
      email,
      password,
      bio,
      profilePicture,
    });

    res.status(200).json({
      success: true,
      message: `User created successfully`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username) {
      return next(createError("Please enter a username", 400));
    } else if (!password) {
      return next(createError("Please enter a password", 400));
    }

    const user = await User.findOne({ username: username });

    if (!user) return next(createError("User not found", 400));

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) return next(createError("Incorrect Password", 400));

    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      maxAge: 7200,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.status(200).json({
      success: true,
      token,
      message: "User successfully logged in",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user)
    return next(createError("There is no user with email address", 400));

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? submit a patch request with your new password to: ${resetURL}.\nIf you didn't forgot your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 minutes)",
      message,
    });

    res.status(200).json({
      success: true,
      message: "Token was successfully reset",
    });
  } catch (error) {
    console.log(error);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      createError("There was an error sending the email. Try again later!", 500)
    );
  }
};

const resetPassword = async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.id)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpiresAt: { $gt: Date.now() },
  });

  if (!user) return next(createError("Token is invalid or has expired", 400));

  user.password = req.body.password;
  user.passwordResetExpiresAt = undefined;
  user.passwordResetToken = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password Successfully Changed!",
    data: user,
  });
};

const updatePassword = async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const isValidPassword = await bcrypt.compare(
    req.body.passwordCurrent,
    user.password
  );

  if (!isValidPassword)
    next(createError("Your current password is invalid", 401));

  user.password = req.body.password;
  await user.save();

  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
    expiresIn: "1h",
  });

  res.status(200).json({
    success: true,
    token,
    message: "Password Successfully Changed!",
    data: user,
  });
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
};
