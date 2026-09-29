import { query } from "express-validator";

/** Validate shared page/limit query parameters. */
const paginationValidation = [
  query("page").optional().isInt({ min: 1 }).withMessage("page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 50 })
    .withMessage("limit must be an integer between 1 and 50"),
];

export default paginationValidation;
