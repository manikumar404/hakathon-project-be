const joi = require("joi");

const endorsementValidator = joi.object({
  title: joi.string().min(5).required(),
  description: joi.string().min(5).required(),
});

module.exports = endorsementValidator;
