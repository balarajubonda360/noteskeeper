import { validationResult } from "express-validator";

/** Return express-validator errors in the API's standard validation format. */
const validate = (req, res, next) => {
  const result = validationResult(req);

  if (result.isEmpty()) return next();

  const errors = result.array().map(({ path, param, msg }) => ({
    field: path || param,
    message: msg,
  }));

  return res.status(400).json({
    success: false,
    message: "Validation failed",
    data: null,
    errors,
  });
};

export default validate;
