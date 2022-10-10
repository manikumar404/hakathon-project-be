const joi = require("joi");

const postValidator = joi.object({
  title: joi.string().min(5).required(),
  description: joi.string().min(5).required(),
});

module.exports = postValidator;
