import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";

/** Register an account and return its token and public user details. */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "An account with this email already exists",
      data: null,
    });
  }

  const configuredAdminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const user = await User.create({ name, email: normalizedEmail, password, ...(configuredAdminEmail === normalizedEmail && { role: "admin" }) });
  const token = generateToken(user.id);
  // select:false protects database reads; explicitly omit the in-memory hash too.
  const safeUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return res.status(201).json({
    success: true,
    message: "Account created successfully",
    data: { token, user: safeUser },
  });
});

/** Authenticate an account without revealing which credential was incorrect. */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.trim().toLowerCase() })
    .select("+password");

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
      data: null,
    });
  }

  if (!user.active) {
    return res.status(403).json({
      success: false,
      message: "This account has been suspended. Contact an administrator.",
      data: null,
    });
  }

  const configuredAdminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (configuredAdminEmail && user.email === configuredAdminEmail && user.role !== "admin") {
    user.role = "admin";
    await user.save();
  }

  const token = generateToken(user.id);
  const safeUser = await User.findById(user.id);

  return res.status(200).json({
    success: true,
    message: "Login successful",
    data: { token, user: safeUser },
  });
});

/** Return the authenticated user's public profile. */
export const getMe = (req, res) => res.status(200).json({
  success: true,
  message: "User retrieved successfully",
  data: req.user,
});
