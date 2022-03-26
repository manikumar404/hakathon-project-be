const joi = require('joi')

const userValidator = joi.object({

    name:joi.string().min(5).required(),
    gender:joi.string().valid('Male','Female','Others'),
    email:joi.string().min(5).email().required(),
    password:joi.string().min(8).required(),
    userType:joi.string().valid('tutor','student'),
    department:joi.string().min(3),
    token:joi.string()


})

module.exports = userValidator