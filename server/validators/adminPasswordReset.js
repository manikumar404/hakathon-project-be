const joi = require('joi')

const adminPasswordReset = joi.object({

   
    newPassword:joi.string().min(8).required(),
    email:joi.string().min(5).email().required()
   

})

module.exports = adminPasswordReset