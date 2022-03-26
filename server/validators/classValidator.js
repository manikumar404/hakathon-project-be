const joi = require("joi");

const classValidator = joi.object({
  moduleName: joi.string().min(5).required(),
  moduleCode: joi.string().min(5).required(),
});

module.exports = classValidator;
