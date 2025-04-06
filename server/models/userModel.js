const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
    },
    gender: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
    },
    country: {
      type: String,
    },
    userType: {
      type: String,
      enum: ["user", "seller"],
      default: "user",
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    verificationToken: String,
    verificationTokenExpires: Date,
  },
  { timestamps: true }
);

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetTokenExpires = Date.now() + 60 * 60 * 1000;

  return resetToken;
};

userSchema.methods.createVerificationToken = function () {
  const verifyToken = crypto.randomBytes(32).toString("hex");

  this.verificationToken = crypto
    .createHash("sha256")
    .update(verifyToken)
    .digest("hex");

  this.verificationTokenExpires = Date.now() + 60 * 60 * 1000;

  return verifyToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
