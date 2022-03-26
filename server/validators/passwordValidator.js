const joi = require('joi')

const passwordValidator = joi.object({

   
    newPassword:joi.string().min(8).required()
   

})

module.exports = passwordValidator