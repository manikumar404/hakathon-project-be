const joi = require('joi')

const userUpdateValidator = joi.object({

    name:joi.string().min(5).required(),
    gender:joi.string().valid('Male','Female','Others'),
    email:joi.string().min(5).email().required(),
    department:joi.string().min(3).required()

})

module.exports = userUpdateValidator