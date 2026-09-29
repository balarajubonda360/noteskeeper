/** Allow only authenticated administrators to use administrative endpoints. */
export default function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Administrator access required",
      data: null,
    });
  }
  return next();
}
