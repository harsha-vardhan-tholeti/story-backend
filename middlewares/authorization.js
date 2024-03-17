const User = require("../models/user.model");
const createError = require("../utils/createError");
const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  if (
    !req?.headers?.authorization &&
    req?.headers?.authorization?.split(" ")[0] === "Bearer"
  )
    return next(createError("Invalid authorization", 400));

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return next(createError("User is not authenticated", 400));

  let userId;

  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return next(createError("jwt expired", 400));
    } else {
      userId = decoded._id;
    }
  });

  const user = await User.findById(userId);

  if (!user) return next(createError("User not found", 400));

  req.user = user;

  next();
};

const restrictTo = (...roles) => {
  return async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        createError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};

module.exports = {
  protect,
  restrictTo,
};
