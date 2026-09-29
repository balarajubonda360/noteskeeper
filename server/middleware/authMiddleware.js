import jwt from "jsonwebtoken";
import User from "../models/User.js";

/** Require a valid bearer token and attach its current user to the request. */
export const protect = async (req, res, next) => {
  const authorization = req.headers.authorization;
  const [scheme, token] = authorization?.split(" ") ?? [];

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token required",
      data: null,
    });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token is invalid or expired",
      data: null,
    });
  }

  // Keep database outages as server errors instead of misreporting them as bad credentials.
  const user = await User.findById(decoded.id);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, user no longer exists",
      data: null,
    });
  }

  if (!user.active) {
    return res.status(401).json({
      success: false,
      message: "This account has been suspended. Contact an administrator.",
      data: null,
    });
  }

  req.user = user;
  return next();
};
