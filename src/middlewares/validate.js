const logger = require("../utils/logger");

const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (result.error) {
      logger.warn("Validation failed: %o", result.error.details);

      return res.status(400).json({
        msg: "Validation error",
        details: result.error.details.map((d) => ({
          message: d.message,
          path: d.path,
        })),
      });
    } 

    req.body = result.value;
    next();
  };
};

module.exports = validate;
