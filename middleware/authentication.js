let jwt=require('jsonwebtoken')

let User_model=require('../models/User')

let {UnauthenticatedError}=require('../errors/index')

let authentication=async(req,res,next)=>
{
    let authHeader=req.headers.authorization
    console.log(authHeader)
    if(!authHeader || !authHeader.startsWith('Bearer '))
    {
        throw new UnauthenticatedError('Invalid')
    }
    let token=authHeader.split(' ')[1]

    try{
    let payload=jwt.verify(token,process.env.JWT_SECRET)
    req.user={userId:payload.userId,name:payload.name}
    }catch(error)
    {
        throw new UnauthenticatedError('Invalid')
    }
    next()

}

module.exports=authentication