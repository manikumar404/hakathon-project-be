const jwt = require('jsonwebtoken')

module.exports = function verify(req,res,next){
    const token = req.headers.authorization
    if(!token) return res.status(401).json('you have to login first')
   try{
    const access = jwt.verify(token,process.env.SECRET)
    req.user = access
    next()
    
}catch(err){
    res.status(400).json('your access token is not valid')
}
   }