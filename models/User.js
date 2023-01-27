let mongoose=require('mongoose')

let bcrypt=require('bcryptjs')

let jwt=require('jsonwebtoken')

let UserSchema=new mongoose.Schema({
    name:{type:String,required:[true,'please provide name'],maxlength:[30,'length should not be more than 30 ']},
    email:{type:String,required:[true,'please provide email'],unique:true,match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,'please provide valid email']},
    password:{type:String,required:[true,'please provide password'],minlength:6}
})

UserSchema.pre('save',async function(next){
    let salt=await bcrypt.genSalt(10)
    this.password=await bcrypt.hash(this.password,salt)
    next()
})

UserSchema.methods.createJWT=function(){
    let userId=this._id
    let name=this.name
    return jwt.sign({userId,name},process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})
}

UserSchema.methods.comparePassword= async function(candidatePassword){
    let ismatch= await bcrypt.compare(candidatePassword, this.password)
    return ismatch
}


module.exports=mongoose.model('User',UserSchema)