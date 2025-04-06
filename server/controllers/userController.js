const User = require("../models/userModel");
const createError = require("../utils/appError");
const bcrypt = require("bcryptjs");

// Get user profile
exports.getUser = async (req, res, next) => {
  try {
    const userEmail = req.user.email;

    const user = await User.findOne({ email: userEmail }).select("-password");

    if (!user) {
      return next(new createError("User not found!", 401));
    }

    res.status(200).json({
      status: "success",
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Update User Profile
exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: req.body },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return next(new createError("User not found!", 404));
    }

    res
      .status(200)
      .json({ message: "Profile updated successfully", updatedUser });
  } catch (error) {
    next(error);
  }
};

// Delete User
exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User Has Been Deleted!" });
  } catch (error) {
    next(error);
  }
};

// Update User Password
exports.updatePassword = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { password: hashedPassword } },
      { new: true }
    );

    if (!updatedUser) {
      return next(new createError("User not found", 404));
    }

    res.status(200).json({ message: "Password Updated Successfully" });
  } catch (error) {
    next(error);
  }
};

//Get All User
exports.getAllUsers = async (req, res, next) => {
  try {
    const loggedInUserId = req.user._id;
    const users = await User.find({
      _id: { $ne: loggedInUserId },
      isAdmin: false,
    }).select("-password");

    const unverifiedUserCount = await User.countDocuments({
      verified: false,
    });

    res.status(200).json({
      status: "success",
      results: users.length,
      unverifiedUsers: unverifiedUserCount,
      users,
    });
  } catch (error) {
    next(error);
  }
};
