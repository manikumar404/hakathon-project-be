const joi = require("joi");

const petitionValidator = joi.object({
  title: joi.string().min(5).required(),
  description: joi.string().min(5).required(),
});

module.exports = petitionValidator;
