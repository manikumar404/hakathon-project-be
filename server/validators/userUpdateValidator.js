const joi = require('joi')

const userUpdateValidator = joi.object({
    userId: joi.string().required(),
    name:joi.string().min(5),
    gender:joi.string().valid('Male','Female','Others'),
    email:joi.string().min(5).email(),
    contact: joi.string(),
    cid: joi.string(),
    userType: joi.string().valid('Admin','User'),
    location: joi.object({
        dzongkhag: joi.string(),
        geog: joi.string()
    })

})

module.exports = userUpdateValidator