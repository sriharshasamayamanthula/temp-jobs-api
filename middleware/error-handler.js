const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')




const errorHandlerMiddleware = (err, req, res, next) => {
  let CustomError={
  msg:err.message || "something went wrong, try later",
  statusCode:err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
}

// Below CustomAPIError is removed, as in CustomError, we are passing message and statuscode from Badrequest class and is copied to CustomError object
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }
  if (err.name === 'ValidationError') {
    CustomError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(',')
    CustomError.statusCode = 400
  }


  if(err.code && err.code===11000)
  {
    CustomError.statusCode=400
    CustomError.msg=`Duplicate value for ${Object.keys(err.keyValue)} field, Please choose different value`
  }

  if (err.name === 'CastError') {
    CustomError.msg = `No item found with id : ${err.value}`
    CustomError.statusCode = 404
  }

    return res.status(CustomError.statusCode).json({msg:CustomError.msg})
  //return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
}

module.exports = errorHandlerMiddleware
