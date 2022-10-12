const joi = require("joi");

const commentValidator = joi.object({
  comment: joi.string().required(),
  endorsementId: joi.string().required(),
  rating: joi.number()

});

module.exports = commentValidator;
