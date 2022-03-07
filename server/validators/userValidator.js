const joi = require('joi')

const userValidator = joi.object({

    name:joi.string().min(5).required(),
    id:joi.string().min(8).required(),
    gender:joi.string().valid('Male','Female','Others'),
    email:joi.string().min(5).email().required(),
    password:joi.string().min(8).required(),
    userType:joi.string().valid('admin','tutor','student')
})

module.exports = userValidator