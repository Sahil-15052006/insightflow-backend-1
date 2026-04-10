const jwt = require('jsonwebtoken')
require("dotenv").config()

module.exports=function(req,res,next){
    let token = req.cookies.token
    if(!token && req.header('Authorization')){
        token = req.header('Authorization').split(" ")[1]
    }
    if(!token) return res.status(401).json({message:'Token not found'})
    try {
        const verified = jwt.verify(token,process.env.JWT_SECRET)
        req.user = verified
        next()
    } catch(err) {
        res.status(401).json({message:"Invalid token"})
    }
}