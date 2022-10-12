const joi = require("joi");

const commentValidator = joi.object({
  comment: joi.string(),
  endorsementId: joi.string().required(),
  rating: joi.number()

});

module.exports = commentValidator;
