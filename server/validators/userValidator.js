const joi = require('joi')

const userValidator = joi.object({

    name:joi.string().min(5).required(),
    gender:joi.string().valid('Male','Female','Others'),
    email:joi.string().min(5).email().required(),
    password:joi.string().min(8).required(),
    contact: joi.string().required(),
    cid: joi.string(),
    userType: joi.string().valid('Admin','User'),
    location: joi.object({
        dzongkhag: joi.string(),
        geog: joi.string()
    })
})

module.exports = userValidator