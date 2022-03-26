const joi = require("joi");

const classUpdateValidator = joi.object({
  moduleName: joi.string().min(5).required(),
  moduleCode: joi.string().min(5).required(),
});

module.exports = classUpdateValidator;
