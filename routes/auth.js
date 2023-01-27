let express=require('express')

let router=express.Router()

let {register,login}=require('../controllers/auth')


router.post('/register',register)

router.post('/login',login)

module.exports=router