const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/userModel");
const createError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/email");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Find User By Token
const findUserByToken = async (tokenField, token) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    [tokenField]: hashedToken,
    [`${tokenField}Expires`]: { $gt: Date.now() },
  });

  return user;
};

const sendVerificationEmail = async (email, verifyToken, protocol) => {
  const verificationURL = `${protocol}://localhost:5173/auth/verifyEmail/${verifyToken}`;

  const message = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #2D3748; padding: 0; max-width: 600px; margin: 0 auto; background-color: #F7FAFC;">
      <!-- Header Section -->
      <div style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <img src="https://yourdomain.com/logo.png" alt="Revive Market Logo" style="width: 140px; margin-bottom: 20px;"/>
        <h1 style="color: #ffffff; font-size: 28px; margin: 0; font-weight: 600;">Verify Your Email Address</h1>
      </div>

      <!-- Main Content Section -->
      <div style="background-color: #ffffff; padding: 40px 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 25px;">Hi there,</p>
        
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
          Welcome to <strong style="color: #4CAF50;">Revive Market</strong>! We're excited to have you join our marketplace community. To get started, please verify your email address by clicking the button below:
        </p>

        <!-- CTA Button -->
        <div style="text-align: center; margin: 35px 0;">
          <a href="${verificationURL}" 
             style="display: inline-block; padding: 14px 35px; font-size: 16px; font-weight: 600; color: #ffffff; 
                    background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); 
                    border-radius: 50px; text-decoration: none; 
                    box-shadow: 0 4px 6px rgba(76, 175, 80, 0.2);
                    transition: all 0.3s ease;">
            Verify My Email
          </a>
        </div>

        <!-- Alternative Link -->
        <div style="background-color: #F7FAFC; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <p style="font-size: 14px; color: #4A5568; margin: 0 0 10px 0;">
            Or copy this link into your browser:
          </p>
          <p style="font-size: 14px; color: #4CAF50; word-break: break-all; margin: 0;">
            <a href="${verificationURL}" style="color: #4CAF50; text-decoration: none;">${verificationURL}</a>
          </p>
        </div>

        <!-- Security Notice -->
        <div style="background-color: #FFF5F5; border-left: 4px solid #F56565; padding: 20px; margin: 25px 0; border-radius: 4px;">
            <p style="font-size: 14px; line-height: 1.6; color: #C53030; margin: 0;">
          If you didn't create a Revive Market account, please ignore this email or contact our support team if you have concerns.
          </p>
        </div>

        <!-- Help Section -->
        <div style="border-top: 1px solid #E2E8F0; margin-top: 25px; padding-top: 25px;">
          <p style="font-size: 14px; color: #718096; line-height: 1.6; margin: 0;">
            Need help? Contact us at <a href="mailto:support@revivemarket.com" style="color: #4CAF50; text-decoration: none;">support@revivemarket.com</a>
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div style="text-align: center; padding: 20px; color: #A0AEC0;">
        <p style="font-size: 13px; margin: 0 0 10px 0;">
          © ${new Date().getFullYear()} Revive Market. All rights reserved.
        </p>
        
      </div>
    </div>
  `;

  await sendEmail({
    email,
    subject: "Welcome to Revive Market - Verify Your Email",
    html: message,
  });
};

// Signup User
exports.signup = async (req, res, next) => {
  try {
    // check if the email is already exist
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      return next(new createError("Email already exist", 400));
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });

    // Generate verification token for the new user
    const verifyToken = newUser.createVerificationToken();
    await newUser.save();

    // Send verification email to user
    await sendVerificationEmail(newUser.email, verifyToken, req.protocol);

    res.status(201).json({
      status: "success",
      message: "Account registered successfully. Verification email sent.",
    });
  } catch (error) {
    next(error);
  }
};

// Login User
exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(new createError("User not found!", 404));
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordValid) {
      return next(new createError("Email or password is incorrect", 401));
    }

    if (!user.verified) {
      if (
        !user.verificationToken ||
        user.verificationTokenExpires < Date.now()
      ) {
        const newverifyToken = user.createVerificationToken();
        await user.save();

        await sendVerificationEmail(user.email, newverifyToken, req.protocol);

        return next(new createError("Please verify your email", 401));
      } else {
        return next(new createError("Please verify your email!", 401));
      }
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "90d",
    });

    // get user type
    const userType = user.userType;
    const userID = user._id;

    res.status(200).json({
      status: "success",
      message: "Login successfully",
      token,
      userType,
      userID,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// SEND EMAIL TO VERIFY USER
exports.verifyEmail = async (req, res, next) => {
  try {
    // 1) Get user based on the token
    const user = await findUserByToken("verificationToken", req.params.token);

    // 2) If token has expired or invalid show error
    if (!user) {
      return next(new createError("Token is invalid or has expired", 400));
    }

    // Mark the user as verified
    user.verified = true;

    // Remove the verification fields
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Email verified successfully. You can now log in.",
    });
  } catch (error) {
    next(error);
  }
};

// FORGOT PASSWORD
exports.forgotPassword = async (req, res, next) => {
  try {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(new createError("No user found with that email!", 404));
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save();

    // 3) Send it to user's email
    const resetURL = `http://localhost:5173/auth/resetPassword/${resetToken}`;

    const message = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #2D3748; padding: 0; max-width: 600px; margin: 0 auto; background-color: #F7FAFC;">
        <!-- Header Section -->
        <div style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <img src="https://yourdomain.com/logo.png" alt="Revive Market Logo" style="width: 140px; margin-bottom: 20px;"/>
          <h1 style="color: #ffffff; font-size: 28px; margin: 0; font-weight: 600;">Reset Your Password</h1>
        </div>

        <!-- Main Content Section -->
        <div style="background-color: #ffffff; padding: 40px 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 25px;">Hi there,</p>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
            We received a request to reset your <strong style="color: #4CAF50;">Revive Market</strong> account password. Click the button below to reset it. This link will expire in 1 hour for security purposes.
          </p>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 35px 0;">
            <a href="${resetURL}" 
               style="display: inline-block; padding: 14px 35px; font-size: 16px; font-weight: 600; color: #ffffff; 
                      background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); 
                      border-radius: 50px; text-decoration: none; 
                      box-shadow: 0 4px 6px rgba(76, 175, 80, 0.2);
                      transition: all 0.3s ease;">
              Reset Password
            </a>
          </div>

          <!-- Alternative Link -->
          <div style="background-color: #F7FAFC; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <p style="font-size: 14px; color: #4A5568; margin: 0 0 10px 0;">
              Or copy this link into your browser:
            </p>
            <p style="font-size: 14px; color: #4CAF50; word-break: break-all; margin: 0;">
              <a href="${resetURL}" style="color: #4CAF50; text-decoration: none;">${resetURL}</a>
            </p>
          </div>

          <!-- Security Notice -->
          <div style="background-color: #FFF5F5; border-left: 4px solid #F56565; padding: 20px; margin: 25px 0; border-radius: 4px;">
            <p style="font-size: 14px; line-height: 1.6; color: #C53030; margin: 0;">
              If you didn't request this password reset, please ignore this email or contact our support team immediately if you have concerns about your account's security.
            </p>
          </div>

          <!-- Help Section -->
          <div style="border-top: 1px solid #E2E8F0; margin-top: 25px; padding-top: 25px;">
            <p style="font-size: 14px; color: #718096; line-height: 1.6; margin: 0;">
              Need help? Contact us at <a href="mailto:support@revivemarket.com" style="color: #4CAF50; text-decoration: none;">support@revivemarket.com</a>
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 20px; color: #A0AEC0;">
          <p style="font-size: 13px; margin: 0 0 10px 0;">
            © ${new Date().getFullYear()} Revive Market. All rights reserved.
          </p>
          
        </div>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: "Reset Your Revive Market Password",
        html: message,
      });

      res.status(200).json({
        status: "success",
        message: "Password reset link sent to your email!",
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      return next(
        new createError(
          "There was an error sending the email. Try again later!",
          500
        )
      );
    }
  } catch (error) {
    next(error);
  }
};

// RESET PASSWORD
exports.resetPassword = async (req, res, next) => {
  try {
    // 1) Get user based on the token
    const user = await findUserByToken("passwordResetToken", req.params.token);

    // 2) if token has expired or invalid show error
    if (!user) {
      return next(new createError("Token is invalid or has expired", 400));
    }
    // 3) If token has not expired, and there is user, set the new password
    const hashedPassword = await bcrypt.hash(req.body.newPassword, 12);
    user.password = hashedPassword;

    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Password reset successfully.",
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

// Sign with Google
exports.loginWithGoogle = async (req, res, next) => {
  try {
    const { token } = req.body;

    // Verify Google token and get user info from Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const { name, email, picture } = payload;

    // Check if the user already exists in the database
    let user = await User.findOne({ email });

    if (!user) {
      // If user doesn't exist, create a new one with a random password
      const hashedPassword = await bcrypt.hash(
        crypto.randomBytes(16).toString("hex"),
        10
      );

      user = await User.create({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        name,
        email,
        password: hashedPassword,
        profileImage: picture,
        verified: true,
      });

      const userToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "90d",
      });

      const userType = user.userType;
      const userID = user._id;

      return res.status(201).json({
        status: "success",
        token: userToken,
        message: "User registered successfully",
        userType,
        userID,
      });
    }

    const userToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "90d",
    });

    const userType = user.userType;
    const userID = user._id;

    res.status(200).json({
      status: "success",
      token: userToken,
      userType,
      userID,
      message: "Google Login successfull",
    });
  } catch (error) {
    next(error);
  }
};
