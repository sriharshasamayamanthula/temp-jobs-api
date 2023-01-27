
let {NotFoundError,BadRequestError}=require('../errors')

let {StatusCodes}=require('http-status-codes')

let Job_model=require('../models/Job')



let getAllJobs=async(req,res)=>{
    let jobs=await Job_model.find({createdBy:req.user.userId}).sort('createdAt')
    res.status(StatusCodes.OK).json({jobs,count:jobs.length})
}

let getJob=async(req,res)=>{
    let {userId}=req.user
    let {id:jobId}=req.params
    let job=await Job_model.findOne({_id:jobId,createdBy:userId})
    if(!job)
    {
       throw new NotFoundError('Job not found')
    }
    res.status(StatusCodes.OK).json(job)
}

let createJob=async(req,res)=>{
    req.body.createdBy=req.user.userId
    let job=await Job_model.create(req.body)
    res.status(StatusCodes.CREATED).json({job})
}

let updateJob=async(req,res)=>{
    let {userId}=req.user
    let {id:jobId}=req.params
    let {company,position}=req.body
    if(!company || !position)
    {
        throw new BadRequestError("provide company and position")
    }

    let job=await Job_model.findOneAndUpdate({_id:jobId,createdBy:userId},req.body,{new:true,runValidators:true})
    if(!job)
    {
        throw new NotFoundError('job not found')
    }
    res.status(StatusCodes.OK).json(job)
}
let deleteJob=async(req,res)=>{
    let {id:jobId}=req.params
    let {userId}=req.user

    let job=await Job_model.deleteOne({_id:jobId,createdBy:userId})
    if(!job)
    {
        throw new NotFoundError("Job not found")
    }
    res.status(StatusCodes.OK).send("Deleted successfully")
    
}

module.exports={getAllJobs,getJob,createJob,deleteJob,updateJob}