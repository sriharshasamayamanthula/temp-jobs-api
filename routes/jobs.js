let express=require('express')

let router=express.Router()

let {getAllJobs,getJob,deleteJob,updateJob,createJob}=require('../controllers/jobs')

router.get('/',getAllJobs)

router.post('/',createJob)

router.get('/:id',getJob)

router.patch('/:id',updateJob)

router.delete('/:id',deleteJob)

module.exports=router