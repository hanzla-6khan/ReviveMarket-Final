const createError = require("../utils/appError");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.verifyToken = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new createError("You are not logged in.", 401));
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    let currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return next(
        new createError("User belonging to this token no longer exists.", 401)
      );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  } catch (error) {
    next(error);
  }
};
