let User_model=require('../models/User')

let jwt=require('jsonwebtoken')

let {StatusCodes}=require('http-status-codes')

let bcrypt=require('bcryptjs')

let {BadRequestError}=require('../errors/index.js')
let {UnauthenticatedError}=require('../errors/index.js')

let register=async(req,res)=>{

    //Did hashing in model document using mongoose pre middleware

    let User=await User_model.create({...req.body})
    //JWT is created in model document using schema instance method.
    let token=User.createJWT()
    res.status(StatusCodes.CREATED).json({token,user:{name:User.name}})
}

let login=async(req,res)=>{

    let {email,password}=req.body
    if(!email || !password)
    {
        throw new BadRequestError('please provide email and password')
    }
    let user=await User_model.findOne({email})
    if(!user)
    {
        throw new UnauthenticatedError('please provide valid credentials')
    }

    // let isPasswordCorrect= await user.comparePassword(password)
    // if(!isPasswordCorrect)
    // {
    //     throw new UnauthenticatedError('please provide valid credentials')
    // }

    let token=user.createJWT()

    res.status(StatusCodes.OK).json({token,user:{name:user.name}})
}


module.exports={register,login}