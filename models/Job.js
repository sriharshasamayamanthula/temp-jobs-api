let mongoose=require('mongoose')

let schema=new mongoose.Schema({
    company:{type:String,required:[true,'please provide company name'],maxlength:50},
    position:{type:String,required:[true,'pleasev provide position name']},
    status:{type:String,enum:['interview','pending','rejected'],default:'pending'},
    createdBy:{type:mongoose.Types.ObjectId,ref:'User'//referring users collection
    ,required:[true,'please provide user']}
},{timestamps:true})

module.exports=mongoose.model('Job',schema)